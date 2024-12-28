import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

type TProps = {
    children: React.ReactNode;
    title: string;
    trigger: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
};

const CustomModal = ({ children, title, trigger, isOpen, onClose }: TProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent aria-describedby="modal-description" className="p-8">
                <h2 className="text-xl md:text-2xl font-semibold text-primary">{title}</h2>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default CustomModal;
