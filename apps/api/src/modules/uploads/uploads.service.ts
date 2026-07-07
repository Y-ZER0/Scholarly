import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient } from "@supabase/supabase-js";
import * as path from "path";

@Injectable()
export class UploadsService {
  private readonly supabase;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>("SUPABASE_URL");
    const key = this.configService.get<string>("SUPABASE_SERVICE_ROLE_KEY");
    this.bucket = this.configService.get<string>(
      "SUPABASE_STORAGE_BUCKET",
      "scholarly-uploads",
    );

    if (!url || !key) {
      throw new Error(
        "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env",
      );
    }

    this.supabase = createClient(url, key, {
      auth: { persistSession: false },
    });
  }

  async uploadImage(
    buffer: Buffer,
    mimetype: string,
    originalname: string,
  ): Promise<string> {
    const ext = path.extname(originalname);
    const { nanoid } = await import("nanoid");
    const filePath = `images/${nanoid()}-${Date.now()}${ext}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filePath, buffer, {
        contentType: mimetype,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(
        `Failed to upload image: ${error.message}`,
      );
    }

    const {
      data: { publicUrl },
    } = this.supabase.storage.from(this.bucket).getPublicUrl(filePath);

    return publicUrl;
  }
}
