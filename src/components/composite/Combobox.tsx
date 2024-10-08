
import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
  current: string
  values: { ID: string, ClerkId: string, Name: string }[]
  isFetching: boolean
  onCreateNew: () => void
  onSelect: (id: string) => Promise<void>
}

export function Combobox({ current, values, onCreateNew, onSelect }: Props) {

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(current)

  const onClickCreate = () => {
    setOpen(false)
    onCreateNew()
  }

  React.useEffect(() => {
    setValue(current)
  }, [current])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between mb-5"
        >
          {value
            ? values.find((element) => element.ID === value)?.Name
            : "Select Organization"}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Organization ..." className="h-9" />
          <CommandEmpty>No organizations found.</CommandEmpty>
          <CommandGroup>
            {values.map((element) => (
              <CommandItem
                key={element.ID}
                value={element.ID}
                onSelect={(currentValue: string) => {
                  setValue(currentValue)
                  onSelect(element.ClerkId)
                  setOpen(false)
                }}
              >
                {element.Name}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === element.ID ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}

            <Button className="w-full justify-start my-1" onClick={onClickCreate}>Create New Org</Button>
          </CommandGroup>

        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Combobox