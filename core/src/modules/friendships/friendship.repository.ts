import { ConflictException, NotFoundException } from "@nestjs/common";
import { EntityRepository, Repository, UpdateResult } from "typeorm";
import { GetUserFriendsDto } from "@modules/users/dto";
import { Friendship } from "./Friendship.entity";
import { FriendshipStatus } from "./FriendshipStatus.enum";
import { GetFriendRequestsDto } from "./dto";
import { FriendshipData } from "./types/Friendship.type";

@EntityRepository(Friendship)
export class FriendshipRepository extends Repository<Friendship> {
  async createFriendship(
    senderId: number,
    receiverId: number
  ): Promise<FriendshipData> {
    const createFriendship = this.create({
      senderId,
      receiverId
    });

    try {
      await this.insert(createFriendship);
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException("Friendship request already exists");
      } else if (error.code === "23503") {
        throw new NotFoundException("User not found");
      }

      throw error;
    }

    return createFriendship;
  }

  findFriendship(
    senderId: number,
    receiverId: number,
    options?: {
      status?: FriendshipStatus;
      relations?: ("sender" | "receiver")[];
      select?: (`friendship.${keyof FriendshipData}` | keyof FriendshipData)[];
    }
  ): Promise<FriendshipData> {
    const qb = this.createQueryBuilder("friendship")
      .select([
        "friendship.id",
        "friendship.senderId",
        "friendship.receiverId",
        "friendship.status"
      ])
      .where({
        senderId,
        receiverId
      });

    if (options?.select) {
      qb.select(options.select);
    }

    if (options?.status) {
      qb.andWhere("status = :status", { status: options.status });
    }

    if (options?.relations) {
      qb.leftJoin("sender", "sender");
      qb.leftJoin("receiver", "receiver");
    }

    return qb.getOne();
  }

  async updateFriendship(
    senderId: number,
    receiverId: number,
    friendship: Partial<FriendshipData>
  ): Promise<FriendshipData | UpdateResult> {
    const { affected } = await this.update(
      { senderId, receiverId },
      friendship
    );

    if (affected === 0) {
      throw new NotFoundException("Friendship request not found");
    }

    return this.findFriendship(senderId, receiverId);
  }

  findFriendshipsOfTwoUsers(
    user1Id: number,
    user2Id: number
  ): Promise<Pick<FriendshipData, "status" | "senderId" | "receiverId">[]> {
    return this.find({
      where: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id }
      ],
      select: ["status", "senderId", "receiverId"]
    });
  }

  async findPendingFriendships(userId: number, filter: GetFriendRequestsDto) {
    const qb = this.createQueryBuilder("friendship")
      .leftJoinAndSelect("friendship.sender", "sender")
      .select([
        "friendship.id",
        "friendship.createdAt",
        "sender.id",
        "sender.name",
        "sender.picture"
      ])
      .where("friendship.receiverId = :userId", { userId })
      .andWhere("friendship.status = :status", {
        status: FriendshipStatus.PENDING
      });

    if (filter.search) {
      qb.andWhere("sender.name ILIKE :search", {
        search: `%${filter.search}%`
      });
    }

    const page = filter.page || 1;
    const limit = filter.limit || 10;
    qb.skip((page - 1) * limit).take(limit);

    const [friendships, count] = await qb.getManyAndCount();

    return {
      requests: friendships as FriendshipData[],
      count,
      page,
      limit
    };
  }

  async findFriends(userId: number, filter: GetUserFriendsDto) {
    const page = filter.page || 1;
    const limit = filter.limit || 15;

    const queryFriends = () =>
      this.query(
      `
      SELECT * 
      FROM 
        (
          SELECT 
            "sender"."id" AS id, 
            "sender"."name" AS name, 
            "sender"."picture" AS picture 
          FROM 
            "friendships" "friendship" 
            LEFT JOIN "users" "sender" ON "sender"."id" = "friendship"."senderId" 
          WHERE 
            "friendship"."receiverId" = $1 
            AND "friendship"."status" = $2
        ) AS query1 
      UNION 
        (
          SELECT 
            "receiver"."id" AS id, 
            "receiver"."name" AS name, 
            "receiver"."picture" AS picture 
          FROM 
            "friendships" "friendship" 
            LEFT JOIN "users" "receiver" ON "receiver"."id" = "friendship"."receiverId" 
          WHERE 
            "friendship"."senderId" = $1 
            AND "friendship"."status" = $2
        ) 
      ORDER BY name ASC 
      LIMIT $3 
      OFFSET $4
      `,
        [userId, FriendshipStatus.ACCEPTED, limit, (page - 1) * limit]
      );

    const qb = this.createQueryBuilder("friendship")
      .select("COUNT(*)")
      .where("receiverId = :userId", { userId })
      .orWhere("senderId = :userId", { userId })
      .andWhere("status = :status", { status: FriendshipStatus.ACCEPTED });

    if (filter.search) {
      qb.andWhere("name ILIKE :search", {
        search: `%${filter.search}%`
      });
    }

    const [count, friends] = await Promise.all([qb.getCount(), queryFriends()]);

    return {
      friends: friends as {
        id: number;
        name: string;
        picture: string;
      }[],
      count,
      page,
      limit
    };
  }

  async findFriendsIds(userId: number): Promise<number[]> {
    const query = `
      SELECT * 
      FROM 
        (
          SELECT 
            "senderId" AS id 
          FROM 
            "friendships" "friendship" 
          WHERE 
            "friendship"."receiverId" = $1 
            AND "friendship"."status" = $2
        ) AS query1 
      UNION 
        (
          SELECT 
            "receiverId" AS id 
          FROM 
            "friendships" "friendship" 
          WHERE 
            "friendship"."senderId" = $1 
            AND "friendship"."status" = $2
        )
    `;
    const result = await this.query(query, [userId, FriendshipStatus.ACCEPTED]);
    return result.map((row: { id: number }) => row.id);
  }
}
