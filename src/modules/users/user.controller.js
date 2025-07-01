import { UserModel } from './user.model.js';

export async function getOrCreateUser(number) {
  let user = await UserModel.findOne({ number });
  if (!user) {
    user = new UserModel({ number });
    await user.save();
  }
  return user;
}

export async function updateUserName(number, name) {
  await UserModel.updateOne({ number }, { name, updatedAt: new Date() });
}
