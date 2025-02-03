import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserInterface extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

UserSchema.pre<UserInterface>('save', async function (next: any) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt: string = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model<UserInterface>('User', UserSchema);

export { User };