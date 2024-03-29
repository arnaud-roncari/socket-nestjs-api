export class UserEntity {
  id: string;
  username: string;
  avatarNumber: string;
  fcmToken: string | null;

  constructor(parameters: UserEntity) {
    Object.assign(this, parameters);
  }

  static fromJson(json: any): UserEntity | null {
    if (!json) {
      return null;
    }

    const user = new UserEntity({
      id: json._id.toString(),
      username: json.username,
      avatarNumber: json.avatar_number,
      fcmToken: json.fcm_token,
    });

    return user;
  }

  static fromJsons(jsons: any[]): UserEntity[] {
    if (!jsons) {
      return [];
    }

    const users: UserEntity[] = [];
    for (const json of jsons) {
      const user = UserEntity.fromJson(json);
      if (user) {
        users.push(user);
      }
    }
    return users;
  }
}
