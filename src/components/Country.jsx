import { useState } from "react";
import Medal from "./Medal";
import { Box, Table, Flex, Badge, Button, Dialog } from "@radix-ui/themes";
import { TrashIcon, CheckIcon, ResetIcon } from "@radix-ui/react-icons";

function Country(props) {
  const [open, setOpen] = useState(false); // Modal state

  function getMedalsTotal() {
    let sum = 0;
    props.medals.forEach((medal) => {
      sum += props.country[medal.name].page_value;
    });
    return sum;
  }

  function renderSaveButton() {
    return props.medals.some(
      (medal) =>
        props.country[medal.name].page_value !==
        props.country[medal.name].saved_value
    );
  }

  return (
    <Box width="300px">
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell colSpan="2">
              <Flex justify="between" align="center" gap="3">
                <Flex align="center" gap="2">
                  <span>{props.country.name}</span>
                  <Badge variant="outline">{getMedalsTotal(props.country, props.medals)}</Badge>
                </Flex>
                <Flex gap="3">
                  {renderSaveButton() && (
                    <>
                      <Button
                        color="gray"
                        variant="ghost"
                        size="1"
                        onClick={() => props.onReset(props.country.id)}
                      >
                        <ResetIcon />
                      </Button>
                      <Button
                        color="gray"
                        variant="ghost"
                        size="1"
                        onClick={() => props.onSave(props.country.id)}
                      >
                        <CheckIcon />
                      </Button>
                    </>
                  )}
                  {props.canDelete && (
                    <Button
                      color="red"
                      variant="ghost"
                      size="1"
                      onClick={() => setOpen(true)} // Open modal
                    >
                      <TrashIcon />
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.medals
            .sort((a, b) => a.rank - b.rank)
            .map((medal) => (
              <Medal
                key={medal.id}
                medal={medal}
                country={props.country}
                canPatch={props.canPatch}
                onIncrement={props.onIncrement}
                onDecrement={props.onDecrement}
              />
            ))}
        </Table.Body>
      </Table.Root>

      {/* Confirmation Modal */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content>
          <Dialog.Title>Are you sure?</Dialog.Title>
          <Dialog.Description>
            Do you really want to delete <strong>{props.country.name}</strong>? This action cannot be undone.
          </Dialog.Description>
          <Flex justify="end" gap="2" mt="2">
            <Button variant="soft" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={() => {
                props.onDelete(props.country.id);
                setOpen(false);
              }}
            >
              Delete
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}

export default Country;
