import { z } from "zod";

const usernameSchema = z.string().min(3).max(20);
const passwordSchema = z.string().min(8).max(20);

export const userSchema = z.object({
  email: z.string().min(3),
  password: z.string().min(3),
});

export const loginResponseSchema = z.object({
  CreatedAt: z.string(),
  UpdatedAt: z.string(),
  DeletedAt: z.nullable(z.string()),
  ID: z.string(),
  Name: z.string(),
  Email: z.string(),
  Password: z.string(),
  Sessions: z.nullable(z.unknown()),
  Organizations: z.array(
    z.object({
      CreatedAt: z.string(),
      UpdatedAt: z.string(),
      DeletedAt: z.nullable(z.string()),
      ID: z.string(),
      UserId: z.string(),
      User: z.nullable(z.unknown()),
      OrganizationId: z.string(),
      Organization: z.object({
        CreatedAt: z.string(),
        UpdatedAt: z.string(),
        DeletedAt: z.nullable(z.string()),
        ID: z.string(),
        Name: z.string(),
        Projects: z.nullable(z.unknown()),
        Users: z.nullable(z.unknown()),
      }),
      Role: z.string(),
    })
  ),
});

export const orgResponseSchema = z.array(
  z.object({
    CreatedAt: z.string(),
    UpdatedAt: z.string(),
    DeletedAt: z.nullable(z.string()),
    ID: z.string(),
    UserId: z.string(),
    User: z.nullable(z.unknown()),
    OrganizationId: z.string(),
    Organization: z.object({
      CreatedAt: z.string(),
      UpdatedAt: z.string(),
      DeletedAt: z.nullable(z.string()),
      ID: z.string(),
      Name: z.string(),
      Projects: z.nullable(z.unknown()),
      Users: z.nullable(z.unknown()),
    }),
    Role: z.string(),
  })
);
