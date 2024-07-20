import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
  MaxLength,
  IsBase64,
} from 'class-validator';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 0,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;

  @IsBase64()
  img: string | undefined;
}

export type UpdateUserDTO = Partial<Omit<UserDTO, 'email'>>;
