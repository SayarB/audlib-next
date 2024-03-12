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

export const projectResponseSchema = z.array(
  z.object({
    CreatedAt: z.string(),
    UpdatedAt: z.string(),
    DeletedAt: z.nullable(z.string()),
    ID: z.string(),
    Name: z.string(),
    OwnerId: z.string(),
    Owner: z.nullable(z.unknown()),
    Versions: z.nullable(
      z.object({
        CreatedAt: z.string(),
        UpdatedAt: z.string(),
        DeletedAt: z.nullable(z.string()),
        ID: z.string(),
        Title: z.string(),
        AudioFileId: z.string(),
        ProjectId: z.string(),
        Project: z.nullable(z.unknown()),
        IsPublished: z.boolean(),
        AuthorId: z.string(),
        Author: z.nullable(z.unknown()),
      })
    ),
    LatestVersion: z.nullable(
      z.object({
        CreatedAt: z.string(),
        UpdatedAt: z.string(),
        DeletedAt: z.nullable(z.string()),
        ID: z.string(),
        Title: z.string(),
        AudioFileId: z.string(),
        ProjectId: z.string(),
        Project: z.nullable(z.unknown()),
        IsPublished: z.boolean(),
        AuthorId: z.string(),
        Author: z.nullable(z.unknown()),
      })
    ),
  })
);

export const projectByIdResponseSchema = z.object({
  CreatedAt: z.string(),
  UpdatedAt: z.string(),
  DeletedAt: z.nullable(z.string()),
  ID: z.string(),
  Name: z.string(),
  OwnerId: z.string(),
  Owner: z.nullable(z.unknown()),
  Versions: z.array(
    z.object({
      CreatedAt: z.string(),
      UpdatedAt: z.string(),
      DeletedAt: z.nullable(z.string()),
      ID: z.string(),
      Title: z.string(),
      AudioFileId: z.string(),
      ProjectId: z.string(),
      Project: z.nullable(z.unknown()),
      IsPublished: z.boolean(),
      AuthorId: z.string(),
      Author: z.object({
        CreatedAt: z.string(),
        UpdatedAt: z.string(),
        DeletedAt: z.nullable(z.string()),
        ID: z.string(),
        Name: z.string(),
        Email: z.string(),
        Password: z.string(),
        Sessions: z.nullable(z.unknown()),
        Organizations: z.nullable(z.unknown()),
      }),
    })
  ),
});

export const currentOrgResponseSchema = z.object({
  CreatedAt: z.string(),
  UpdatedAt: z.string(),
  DeletedAt: z.nullable(z.string()),
  ID: z.string(),
  Name: z.string(),
  Projects: z.nullable(z.unknown()),
  Users: z.nullable(z.unknown()),
  Sessions: z.nullable(z.unknown()),
});

export const versionResponseSchema = z.object({
  CreatedAt: z.string(),
  UpdatedAt: z.string(),
  DeletedAt: z.nullable(z.string()),
  ID: z.string(),
  Title: z.string(),
  AudioFileId: z.string(),
  ProjectId: z.string(),
  Project: z.object({
    CreatedAt: z.string(),
    UpdatedAt: z.string(),
    DeletedAt: z.nullable(z.string()),
    ID: z.string(),
    Name: z.string(),
    OwnerId: z.string(),
    Owner: z.nullable(z.unknown()),
    Versions: z.nullable(z.unknown()),
  }),
  IsPublished: z.boolean(),
  AuthorId: z.string(),
  Author: z.nullable(z.unknown()),
});

export const createProjectSchema = z.object({
  name: z.string(),
});
