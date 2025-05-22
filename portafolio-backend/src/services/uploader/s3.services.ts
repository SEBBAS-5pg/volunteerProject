import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { env } from "process";

Injectable();
export class UploaderService {
  deleteJpeg(oldS3KeyBase: any) {
    throw new Error('Method not implemented.');
  }
  uploadJpeg(imageFile: Express.Multer.File, s3KeyBase: string) {
    throw new Error('Method not implemented.');
  }
  private client: S3Client;
  private bucketName: string;
  private region: string
  constructor(private readonly configService: ConfigService) {
     this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME')!;
    this.region = this.configService.get<string>('AWS_REGION')!;
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID')!;
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!;

    if (!this.bucketName || !this.region || !accessKeyId || !secretAccessKey) {
      throw new InternalServerErrorException('Faltan variables de entorno críticas para AWS S3. Verifica tu archivo .env.');
        }
    this.client = new S3Client({
        region: this.region,
        credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey
        }
    })
  }

  async upload(image: Express.Multer.File, key: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key + '.jpg',
      Body: image.buffer,
    });

    await this.client.send(command);
  }

  async getSignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key + '.jpg',
    });

    return await getSignedUrl(this.client, command, { expiresIn: 3600 });
  }

  async delete(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key + '.jpg',
    });

    await this.client.send(command);
  }
}