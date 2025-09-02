"use client";
import React, { useEffect } from "react";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import { PopularCityList } from "./_components/PopularCityList";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";

function Provider({ children }: { children: React.ReactNode }) {
  const CreateUser = useMutation(api.user.createUser);

  const [userDetail , setUserDetail] = React.useState<any>();

  const { user } = useUser();

  useEffect(() => {
    user && CreateNewUser();
  }, [user]);

  const CreateNewUser = async () => {
    // Logic to create a new user
    const result = await CreateUser({
      email: user?.primaryEmailAddress?.emailAddress ?? "",
      imageUrl: user?.imageUrl ?? "",
      name: user?.fullName ?? "",
    });
    setUserDetail(result);
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <div>
        <Header />
        {children}
      </div>
    </UserDetailContext.Provider>
  );
}

export default Provider;


export const useUserDetail = () => {
  return React.useContext(UserDetailContext);
};