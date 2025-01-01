import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type TAlertProps = {
    trigger: React.ReactNode;
    description: string;
    onConfirm: () => void;
    confirmLabel?: string;
    title?: string;
};

const CustomAlertDialogConfirmation = ({
    trigger,
    description,
    onConfirm,
    confirmLabel = 'Delete',
    title = 'Are you absolutely sure?',
}: TAlertProps) => {

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="">Cancel</AlertDialogCancel>
                    <AlertDialogAction className='bg-red-500 hover:bg-red-700' onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CustomAlertDialogConfirmation;
