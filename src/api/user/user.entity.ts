import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";
import bcrypt from "bcryptjs";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({ default: false })
  isVerified!: boolean;

  @Column({ type: "varchar", length: 6, nullable: true })
  otp?: string | null;

  @Column({ type: "timestamp", nullable: true })
  otpExpires?: Date | null;

  @Column({ type: "timestamp", nullable: true, select: false })
  passwordChangedAt?: Date | null;

  @Column({ type: "uuid", nullable: true, select: false })
  sessionVersion?: string | null;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}
