import * as bcrypt from 'bcrypt';
import { IHashPasswordProvider } from './hasy-password-provider.interface';

export class HashPasswordProvider implements IHashPasswordProvider{
    async compare(pass: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(pass, hash);
    }

    hash(pass: string): Promise<string> {
        return bcrypt.hash(pass, Number(process.env.SALT));
    }
}