import { z } from 'zod';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const OrgSchema = z.object({
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
        ClerkId: z.string(),
        Name: z.string(),
        Projects: z.nullable(z.unknown()),
        Users: z.nullable(z.unknown()),
    }),
    Role: z.string(),
});

type Org = z.infer<typeof OrgSchema>;
type Props = {
    org: Org;
    onDelete: () => void;
    switchOrg: (clerkId: string) => void;
    isCurrent: boolean;
}
const OrgListItem = ({ org, onDelete, switchOrg, isCurrent }: Props) => {
    return (
        <li key={org.ID} className='w-full border-2 rounded-md p-2 m-2 flex justify-between'>
            <div className='flex-col'>
                <div className='flex items-center'>
                    <p className='font-bold text-xl mr-2'>{org.Organization.Name}</p>
                    {isCurrent && <Badge variant={'outline'}>Current</Badge>}
                </div>

            </div>
            <div className='flex'>
                {!isCurrent &&
                    <Button className='mr-2' variant={'ghost'} onClick={() => switchOrg(org.Organization.ClerkId)}>Switch</Button>
                }
                <Button variant={'destructive'} onClick={onDelete} disabled={isCurrent}>Delete</Button>
            </div>
        </li>
    )
}

export default OrgListItem