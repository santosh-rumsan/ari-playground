import { FormControl } from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';

type IProps = {
  data: User;
};

export default function UserDetail({ data }: IProps) {
  const { isPending, error, data: roleData } = roleQuery.userRoleList({});
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        <SelectGroup>
          {roles.length &&
            roles.map((role) => (
              <SelectItem value={role} key={role}>
                {role}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
