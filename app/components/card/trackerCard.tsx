import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Link,
  Image,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { GoTrash } from "react-icons/go";
import { LiaEditSolid } from "react-icons/lia";
import { GoLink } from "react-icons/go";
import { IoFilterOutline } from "react-icons/io5";
export function TrackerCard({
  id,
  name,
  link,
  status,
  removeAirdrop,
}: {
  id: string;
  name: string;
  link: string;
  status: string;
  removeAirdrop: () => void;
}) {
  const [airdropStatus, setAirdropStatus] = useState<any>(status);
  const [isDeleting, setisDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const session = useSession();
  //get token
  //@ts-ignore
  const token = session?.data?.user?.token;

  //update airdrop
  const updateAirdrop = async (status: string | undefined) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/routes/airdrops/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the JWT token in the Authorization header
        },
        body: JSON.stringify({ name, link, status }),
      });

      if (!response.ok) {
        setIsUpdating(false);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update airdrop");
      } else {
        setAirdropStatus(status);
      }
      setIsUpdating(false);
    } catch (error) {
      alert("Error updating airdrop,try again");
      setIsUpdating(false);
    } finally {
      setIsUpdating(false);
    }
  };

  //delete airdrop
  const deleteAirdrop = async () => {
    setisDeleting(true);
    try {
      const response = await fetch(`/api/routes/airdrops/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Add the JWT token in the Authorization header
        },
      });
      setisDeleting(false);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete airdrop");
      } else {
        removeAirdrop();
      }
    } catch (error) {
      setisDeleting(false);
    } finally {
      setisDeleting(false);
    }
  };

  //set status text
  const StatusText = useCallback(
    (status: string) => {
      switch (status.toLowerCase()) {
        case "new":
          return <p className=" font-normal font-md text-primary">New</p>;
        case "ongoing":
          return <p className=" font-normal font-md text-warning">Ongoing</p>;
        case "done":
          return <p className=" font-normal font-md text-success">Done</p>;
        default:
          return <p className=" font-normal font-md text-primary">New</p>;
      }
    },
    [airdropStatus]
  );
  return (
    <Card shadow="md" className="dark:bg-[#343d4a]  w-full h-[200px]">
      <CardHeader className="text-center mb-0 w-full pb-0">
        <p className=" font-semibold text-lg dark:color-white text-center w-full mt-2">
          {name}
        </p>
        <Button
          className="absolute top-[1] right-2 w-8 h-8 min-w-0 bg-transparent shadow-md"
          isIconOnly
          onPress={deleteAirdrop}
          title="delete"
        >
          {isDeleting ? (
            <Spinner color="default" size="sm" />
          ) : (
            <GoTrash color="black" size="18" />
          )}
        </Button>
      </CardHeader>
      <CardBody className="flex flex-col gap-2 items-center  align-middle text-center   flex-1">
        <div className="flex flex-col gap-2">
          <div className="flex justify-center gap-2 items-center">
            <p className=" font-semibold font-lg ">Status</p>
            <Dropdown placement="bottom-end" className="dark:bg-[#626974]">
              <DropdownTrigger>
                <Button
                  variant="flat"
                  className="w-7 h-7 rounded-full text-center p-0 text-md min-w-0"
                  isIconOnly
                  title="edit"
                >
                  {isUpdating ? (
                    <Spinner color="default" size="sm" />
                  ) : (
                    <LiaEditSolid color="black" size="18" />
                  )}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Static Actions"
                variant="flat"
                className="text-black"
                classNames={{
                  base: "dark:bg-[#626974]",
                  list: "dark:text-white",
                }}
                selectedKeys={airdropStatus}
                selectionMode="single"
                onSelectionChange={(e) => {
                  updateAirdrop(e.currentKey);
                }}
              >
                <DropdownItem key="new" color="primary">
                  New
                </DropdownItem>
                <DropdownItem key="Ongoing" color="warning">
                  Ongoing
                </DropdownItem>
                <DropdownItem key="Done" color="success">
                  Done
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          {StatusText(airdropStatus)}
        </div>
        <Button
          color="primary"
          className="w-3/4"
          as={Link}
          href={link}
          target="_blank"
          endContent={<GoLink color="white" size={20} />}
          title="view"
        >
          View
        </Button>
      </CardBody>
    </Card>
  );
}
