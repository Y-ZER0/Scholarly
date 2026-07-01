import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>("GOOGLE_CLIENT_ID")!,
      clientSecret: config.get<string>("GOOGLE_CLIENT_SECRET")!,
      callbackURL: `${config.get<string>("API_URL", "http://localhost:3001")}/api/auth/google/callback`,
      scope: ["email", "profile"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: {
      name?: { givenName?: string; familyName?: string };
      emails?: { value: string }[];
      photos?: { value: string }[];
    },
  ) {
    const { name, emails, photos } = profile;
    return {
      email: emails?.[0]?.value,
      name: name?.givenName
        ? `${name.givenName} ${name.familyName ?? ""}`.trim()
        : "Unknown",
      photo: photos?.[0]?.value,
    };
  }
}
