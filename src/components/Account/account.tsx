"use client";
import React from "react";
import CreateAccountForm from "@/components/Account/create-account-form";
import CustomModal from "@/components/Global/custom-modal";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";




const Account = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const onClose = () => {
        setIsOpen(false);
    };

    const onOpen = () => {
        setIsOpen(true);
    };

    return (
        <CustomModal
            trigger={

                <Card className="flex-center flex-col gap-4 w-fit py-6 px-10 shadow-md hover:bg-primary-foreground cursor-pointer hover:shadow-xl  hover:scale-y-105 transition-all duration-300 min-w-[260px] min-h-[150px]" onClick={onOpen}>
                    <Plus size={40} className="font-extrabold" />
                    <span className="text-xl font-semibold text-muted-foreground">
                        Create Account
                    </span>
                </Card>
            }
            isOpen={isOpen}
            onClose={onClose}
            title="Create Account"
        >


            <CreateAccountForm onClose={onClose} />
        </CustomModal>
    );
};

export default Account






