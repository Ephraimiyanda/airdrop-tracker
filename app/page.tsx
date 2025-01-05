"use client";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Selection,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { TrackerCard } from "./components/card/trackerCard";
import { div } from "framer-motion/client";
import { CiSearch } from "react-icons/ci";
import { IoFilterOutline } from "react-icons/io5";

interface airdrops {
  name: string;
  status: string;
  link: string;
  _id: string;
}
export default function Home() {
  const [airdropStatus, setAirdropStatus] = useState<any>("new");
  const [airdropName, setAirdropName] = useState("");
  const [airdropLink, setAirdropLink] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState<ReactNode>("");
  const [airdropLoading, setAirdropLoading] = useState(true);
  const [airdrops, setAirdrops] = useState<airdrops[]>([]);
  const [searchValue, setSearchValue] = useState("");
  //secure page
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth");
    },
  });
  //get token
  //@ts-ignore
  const token = session?.data?.user?.token;

  const fetchAirdrops = async () => {
    try {
      const response = await fetch("/api/routes/airdrops", {
        method: "GET",
        headers: {
          AUTHORIZATION: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setAirdropLoading(false);
        throw new Error(errorData.message || "Failed to fetch airdrops");
      }

      const airdropsRes = await response.json();
      setAirdrops(airdropsRes);
    } catch (error) {
      setAirdropLoading(false);
      //@ts-ignore
    } finally {
      setAirdropLoading(false);
    }
  };

  // Example usage
  useEffect(() => {
    if (token) {
      fetchAirdrops();
    }
  }, [token]);

  //create tracker
  const createAirdrop = async () => {
    setFormLoading(true);
    const data = {
      name: airdropName,
      link: airdropLink,
      status: airdropStatus,
    };
    try {
      const response = await fetch("/api/routes/airdrops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          AUTHORIZATION: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const airdrop = await response.json();

      if (!response.ok) {
        setFormLoading(false);
        setMessage(<p className="text-danger">Failed to create airdrop</p>);
      } else {
        //
        setAirdropName("");
        setAirdropLink("");
        setFormLoading(false);
        setAirdrops((prev: any) => [...prev, airdrop]);
        setMessage(
          <p className="text-success">Tracker created successfully</p>
        );
        setTimeout(() => {
          onClose();
          setMessage("");
        }, 1000);
      }
    } catch (error) {
      //@ts-ignore
      setMessage(<p className="text-danger">Failed to create airdrop</p>);
      setFormLoading(false);
    } finally {
      setFormLoading(false);
    }
  };

  if (session.status === "loading") {
    return (
      <div className="m-auto w-full h-full min-h-screen flex justify-center items-center">
        <Spinner color="primary" size="md" />
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-800 min-h-screen">
      <Navbar
        position="sticky"
        classNames={{
          wrapper: "px-3",
        }}
        isBlurred={false}
        isBordered
      >
        <NavbarBrand>
          <p className="font-bold text-xl text-inherit">Airdrop Tracker</p>
        </NavbarBrand>

        <NavbarContent
          justify="center"
          className="gap-2 sm:flex hidden  flex-[2]"
        >
          <NavbarItem className="flex justify-normal gap-2 items-center">
            <input
              required
              name="link"
              placeholder="Search for airdrop's"
              type="url"
              className={
                "dark:bg-[#4b535f] bg-white text-black dark:text-white h-10 py-3 px-2 rounded-lg shadow-sm border-1 w-full border-gray-400 outline-none focus:border-black "
              }
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            />
            <Button color="primary" isIconOnly onPress={onOpen}>
              <CiSearch color="white" size={18} />
            </Button>
            <Button color="default" isIconOnly onPress={onOpen}>
              <IoFilterOutline color="black" size={18} />
            </Button>
            
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end" className="gap-2">
          <NavbarItem>
            <Button color="success" variant="flat" onPress={onOpen}>
              Create
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button color="danger" variant="flat" onPress={() => signOut()}>
              LogOut
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <Modal
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
        className="w-[95%] max-w-[300px] dark:bg-[#343d4a]"
        backdrop="opaque"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create new tracker
              </ModalHeader>
              <ModalBody>
                <form
                  action=""
                  className="flex flex-col gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    createAirdrop();
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="name"
                      className=" text-black dark:text-white"
                    >
                      Airdrop name
                    </label>
                    <input
                      required
                      name="name"
                      placeholder="Enter your airdrop name"
                      type="text"
                      className={
                        "dark:bg-[#4b535f] bg-white text-black dark:text-white h-10 py-3 px-2 rounded-lg shadow-sm border-1  outline-none"
                      }
                      value={airdropName}
                      onChange={(e) => {
                        setAirdropName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="link"
                      className=" text-black dark:text-white"
                    >
                      Airdrop link
                    </label>
                    <input
                      required
                      name="link"
                      placeholder="https://example.com"
                      type="url"
                      className={
                        "dark:bg-[#4b535f] bg-white text-black dark:text-white h-10 py-3 px-2 rounded-lg shadow-sm border-1  outline-none"
                      }
                      value={airdropLink}
                      onChange={(e) => {
                        setAirdropLink(e.target.value);
                      }}
                    />
                  </div>
                  <Select
                    aria-label="status"
                    label="Status"
                    labelPlacement="outside"
                    placeholder="select tracker status"
                    variant="flat"
                    className="text-black"
                    classNames={{
                      listbox: "dark:bg-[#626974] dark:text-white ",
                      trigger:
                        "dark:bg-[#626974] hover:dark:bg-[#626974] dark:text-white",
                      innerWrapper: "dark:bg-[#626974]",
                      popoverContent: "dark:bg-[#626974]",
                      value: "group-data-[has-value=true]:dark:text-white",
                      label: "text-base",
                    }}
                    value={airdropStatus}
                    selectionMode="single"
                    onChange={(e) => {
                      setAirdropStatus(e.target.value);
                    }}
                  >
                    <SelectItem key="new" color="primary">
                      New
                    </SelectItem>
                    <SelectItem key="Ongoing" color="warning">
                      Ongoing
                    </SelectItem>
                    <SelectItem key="Done" color="success">
                      Done
                    </SelectItem>
                  </Select>
                  <div>{message}</div>
                  <div className="flex gap-3 justify-end py-3">
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      color="primary"
                      type="submit"
                      isLoading={formLoading}
                    >
                      Create tracker
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="max-w-[1024px] grid gap-4 grid-cols-1 content-start items-start auto-rows-auto gap-x-3 gap-y-3 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 px-3 py-8 m-auto w-full h-full ">
        {airdrops &&
          !airdropLoading &&
          airdrops.map((airdrop) => (
            <TrackerCard
              key={airdrop._id}
              id={airdrop._id}
              name={airdrop.name}
              link={airdrop.link}
              status={airdrop.status}
              removeAirdrop={() => {
                setAirdrops((prevAirdrops) =>
                  prevAirdrops.filter(
                    (airdrops) => airdrops._id !== airdrop._id
                  )
                );
              }}
            />
          ))}
      </div>
      {airdropLoading && (
        <div className="m-auto w-full h-full  flex justify-center items-center">
          <Spinner color="primary" size="md" />
        </div>
      )}
      {airdrops && !airdropLoading && airdrops.length === 0 && (
        <div className="m-auto w-full h-full flex justify-center items-center">
          <p className="text center">No airdrop tracker available</p>
        </div>
      )}
    </div>
  );
}
Home.auth = true;
