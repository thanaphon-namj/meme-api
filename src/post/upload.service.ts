import { CompleteMultipartUploadOutput, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  uploadFile(
    file: Express.Multer.File,
  ): Promise<CompleteMultipartUploadOutput> {
    const s3 = new S3Client({
      region: process.env.AWS_DEFAULT_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const fileStream = Readable.from(file.buffer);

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: process.env.AWS_BUCKET,
        Key: file.originalname,
        Body: fileStream,
        ACL: 'public-read',
      },
    });

    return upload.done();
  }
}
