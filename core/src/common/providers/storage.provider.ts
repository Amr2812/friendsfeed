import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { Bucket, Storage } from "@google-cloud/storage";

@Injectable()
export class CloudStorageService {
  private bucket: Bucket;
  private storage: Storage;

  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage({
      projectId: this.configService.get("storage.projectId"),
      keyFilename: this.configService.get("storage.keyFilename")
    });

    this.bucket = this.storage.bucket(
      this.configService.get("storage.GCSBucket")
    );
  }

  public async deleteFile(folder: string, name: string): Promise<void> {
    await this.bucket.file(`${folder}/${name}`).delete();
  }
}

@Injectable()
export class GCStorage {
  private getDestination: MulterOpts["destination"];
  private fileType: string;
  private maxFileSize: number;
  private bucket: Bucket;
  private storage: Storage;

  constructor(private readonly configService: ConfigService, opts: MulterOpts) {
    if (!opts.destination) {
      throw new Error("destination is required");
    }
    this.getDestination = opts.destination;

    if (opts.fileType) {
      this.fileType = opts.fileType;
    }

    this.maxFileSize = this.configService.get("storage.maxFileSize");

    this.storage = new Storage({
      projectId: this.configService.get("storage.projectId"),
      keyFilename: this.configService.get("storage.keyFilename")
    });

    this.bucket = this.storage.bucket(
      this.configService.get("storage.GCSBucket")
    );
  }

  _handleFile(
    req: Request,
    file: Express.Multer.File,
    cb: (error?: any, info?: { publicUrl: string }) => (...args: any[]) => void
  ) {
    this.getDestination(req, file, (err, { name, folder }: FileDestination) => {
      if (err) return cb(err);

      if (this.fileType) {
        if (!file.mimetype.includes(this.fileType)) {
          return cb(
            new BadRequestException(`Invalid file type ${file.mimetype}`)
          );
        }
      }

      if (parseInt(req.headers["content-length"]) > this.maxFileSize) {
        return cb(
          new BadRequestException(
            `File size too large (max: ${this.maxFileSize / 1000000} MB)`
          )
        );
      }

      let totalSize = 0;
      file.stream
        .on("data", chunk => {
          totalSize += chunk.length;
          if (totalSize > this.maxFileSize) {
            return cb(
              new BadRequestException(
                `File size too large (max: ${this.maxFileSize / 1000000} MB)`
              )
            );
          }
        })
        .pipe(this.bucket.file(`${folder}/${name}`).createWriteStream())
        .on("error", err => cb(new InternalServerErrorException(err.message)))
        .on("finish", () =>
          cb(null, {
            publicUrl: this.bucket.file(`${folder}/${name}`).publicUrl()
          })
        );
    });
  }

  _removeFile(
    req: Request,
    file: Express.Multer.File,
    cb: (...args: any[]) => void
  ) {
    this.getDestination(
      req,
      file,
      async (err, { folder, name }: FileDestination) => {
        if (err) return cb(err);

        const res = await this.bucket.file(`${folder}/${name}`).delete();
        cb(null, res);
      }
    );
  }
}

interface MulterOpts {
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error, FileDestination: FileDestination) => void
  ) => void;
  fileType?: string;
};

interface FileDestination {
  name: string;
  folder: string;
};
