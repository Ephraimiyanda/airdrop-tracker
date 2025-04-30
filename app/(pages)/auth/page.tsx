"use client";
import React, { ReactNode, useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Link,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function App() {
  const [selected, setSelected] = useState<any>("login");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<ReactNode>("");

  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  //set error message
  useEffect(() => {
    if (error) {
      setIsLoading(false);
      setMessage(<p className="text-danger">{error}</p>);
    }
  }, [error]);

  //register user
  const registerUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/routes/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userName, password }),
      });
      if (!response.ok) {
        setIsLoading(false);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register");
      }
      if (response.status === 200) {
        setMessage(<p className="text-success">Registered succesfull</p>);
        signIn("credentials", {
          username: userName,
          password,
          redirect: true,
          callbackUrl: "/",
        });
      } else if (response.status === 402) {
        setMessage(
          <p className="text-warning">Username already exists succesfull</p>
        );
      }
    } catch (error: any) {
      setMessage(<p className="text-danger">An error has occured</p>);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full py-8 justify-center items-center min-h-screen">
      <Card className="max-w-full w-[340px] h-[430px] dark:bg-[#343d4a] bg-white">
        <CardHeader className="w-full  font-semibold text-lg ">
          <p className="text-center w-full">AirDrop Tracker</p>
        </CardHeader>
        <CardBody className="overflow-hidden">
          <Tabs
            isDisabled={isLoading}
            fullWidth
            selectedKey={selected}
            size="md"
            onSelectionChange={setSelected}
            classNames={{
              tabContent: "dark:group-data-[selected=true]:text-white",
              cursor: "w-full dark:bg-[#4b535f]",
              tabList:
                "dark:bg-transparent text-white border-1  border-solid border dark:border-gray-800",
            }}
          >
            <Tab key="login" title="Login">
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsLoading(true);
                  signIn("credentials", {
                    username: userName,
                    password,
                    redirect: true,
                    callbackUrl: "/",
                  });
                }}
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="username"
                    className=" text-black dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    required
                    name="username"
                    placeholder="Enter your username"
                    type="text"
                    className={
                      "dark:bg-[#4b535f] bg-white text-black dark:text-white h-10 py-3 px-2 rounded-lg shadow-sm border-1  outline-none"
                    }
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="Password"
                    className=" text-black dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    required
                    name="Password"
                    placeholder="Enter your password"
                    type="password"
                    className={
                      "dark:bg-[#4b535f] bg-white text-black dark:text-white h-10 py-3 px-2 rounded-lg shadow-sm border-1  outline-none"
                    }
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
                {message}
                <div className="flex gap-2 justify-end">
                  <Button
                    fullWidth
                    color="primary"
                    type="submit"
                    isLoading={isLoading}
                  >
                    Login
                  </Button>
                </div>
                <p className="text-center text-small ">
                  Need to create an account?{" "}
                  <Link
                    className="cursor-pointer"
                    size="sm"
                    onPress={() => setSelected("sign-up")}
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </Tab>
            <Tab key="sign-up" title="Sign up">
              <form
                className="flex flex-col gap-4 h-[300px]"
                onSubmit={(e) => {
                  e.preventDefault();
                  registerUser();
                }}
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="username"
                    className=" text-black dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    required
                    name="username"
                    placeholder="Enter your username"
                    type="text"
                    className={
                      "dark:bg-[#4b535f] bg-white text-black dark:text-white h-10 py-3 px-2 rounded-lg shadow-sm border-1  outline-none"
                    }
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="Password"
                    className=" text-black dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    required
                    name="Password"
                    placeholder="Enter your password"
                    type="password"
                    className={
                      "dark:bg-[#4b535f] bg-white text-black dark:text-white h-10 py-3 px-2 rounded-lg shadow-sm border-1  outline-none"
                    }
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
                {message}

                <div className="flex gap-2 justify-end">
                  <Button
                    fullWidth
                    color="primary"
                    type="submit"
                    isLoading={isLoading}
                  >
                    Sign up
                  </Button>
                </div>
                <p className="text-center text-small">
                  Already have an account?{" "}
                  <Link
                    className="cursor-pointer"
                    size="sm"
                    onPress={() => setSelected("login")}
                  >
                    Login
                  </Link>
                </p>
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
