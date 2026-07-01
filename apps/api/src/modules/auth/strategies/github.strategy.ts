import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>("GITHUB_CLIENT_ID")!,
      clientSecret: config.get<string>("GITHUB_CLIENT_SECRET")!,
      callbackURL: `${config.get<string>("API_URL", "http://localhost:3001")}/api/auth/github/callback`,
      scope: ["user:email"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: {
      displayName?: string;
      username?: string;
      emails?: { value: string }[];
      photos?: { value: string }[];
    },
  ) {
    const { displayName, username, emails, photos } = profile;
    return {
      email: emails?.[0]?.value,
      name: displayName ?? username ?? "Unknown",
      photo: photos?.[0]?.value,
    };
  }
}
