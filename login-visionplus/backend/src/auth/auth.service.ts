import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

// Simple Mock User Interface
interface MockUser {
    _id: string;
    email: string;
    password: string;
    name?: string;
    resetToken?: string;
    resetTokenExpiry?: Date;
}

@Injectable()
export class AuthService {
    // In-memory user storage
    private users: MockUser[] = [];

    constructor(
        private jwtService: JwtService,
    ) {
        // Create a test user initially
        this.preloadTestUser();
    }

    private async preloadTestUser() {
        const hashedPassword = await bcrypt.hash('password123', 10);
        this.users.push({
            _id: 'test-user-id',
            email: 'test@example.com',
            password: hashedPassword,
            name: 'Test User'
        });
        console.log('Mock: Test user preloaded (test@example.com / password123)');
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        console.log('Mock: Intentando loguear a:', email);

        const user = this.users.find(u => u.email === email);

        if (!user) {
            console.log('Mock: El usuario no existe');
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Mock: Password incorrecto');
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = { sub: user._id, email: user.email };
        const token = await this.jwtService.signAsync(payload);

        console.log('Mock: Login exitoso para:', email);

        return {
            access_token: token,
            user: {
                id: user._id,
                email: user.email,
            },
        };
    }

    async createUser(email: string, password: string) {
        // reuse register logic or direct push
        return this.register({ email, password, name: 'Created User' });
    }

    async register(registerDto: { email: string; password: string; name?: string }) {
        const { email, password, name } = registerDto;

        console.log('Mock: Registrando nuevo usuario:', email);

        const existingUser = this.users.find(u => u.email === email);

        if (existingUser) {
            console.log('Mock: Ya existe alguien con ese correo');
            throw new UnauthorizedException('El correo electrónico ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: MockUser = {
            _id: Math.random().toString(36).substring(7),
            email,
            password: hashedPassword,
            name
        };

        this.users.push(newUser);

        console.log('Mock: Usuario registrado y guardado en memoria:', email);

        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    async validateUserById(userId: string) {
        const user = this.users.find(u => u._id === userId);

        if (!user) {
            throw new UnauthorizedException();
        }

        const { password, ...result } = user;
        return result;
    }

    async forgotPassword(email: string) {
        console.log('Mock: Solicitud de recuperacion para:', email);
        const user = this.users.find(u => u.email === email);
        if (!user) {
            return { message: 'Si el correo existe, recibirás instrucciones...' };
        }

        const resetToken = 'mock-reset-token-' + Math.random().toString(36).substring(7);
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;

        console.log('Mock Token:', resetToken);

        return {
            message: 'Si el correo existe, recibirás instrucciones...',
            devToken: resetToken,
        };
    }

    async resetPassword(token: string, newPassword: string) {
        const user = this.users.find(u => u.resetToken === token);

        if (!user || (user.resetTokenExpiry && user.resetTokenExpiry < new Date())) {
            throw new UnauthorizedException('Token inválido o expirado');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        return { message: 'Contraseña actualizada exitosamente.' };
    }
}
