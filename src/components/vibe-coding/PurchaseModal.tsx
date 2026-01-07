import { useState } from "react";
import { QuickPurchaseForm } from "@/components/vibe-coding/QuickPurchaseForm";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { TbPremiumRights, TbCheck, TbBrandTelegram } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";

interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    prefillMessage?: string;
}

export default function PurchaseModal({ isOpen, onClose, prefillMessage }: PurchaseModalProps) {
    const [isSuccess, setIsSuccess] = useState(false);

    const handleClose = () => {
        setIsSuccess(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md w-full bg-background/95 backdrop-blur-xl border-border p-6 gap-0 overflow-hidden outline-none">
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <DialogHeader className="mb-6 text-center">
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center mx-auto mb-4 border border-purple-500/20 shadow-inner"
                                >
                                    <TbPremiumRights className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                </motion.div>
                                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
                                    Premium წვდომა
                                </DialogTitle>
                                <DialogDescription className="text-base text-muted-foreground/80">
                                    შეავსეთ ფორმა ექსკლუზიური მასალების მისაღებად
                                </DialogDescription>
                            </DialogHeader>

                            <QuickPurchaseForm
                                defaultValues={{
                                    service: "Vibe Coding Premium",
                                    message: prefillMessage || "Purchase Request"
                                }}
                                onSuccess={() => setIsSuccess(true)}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, type: "spring", bounce: 0.5 }}
                            className="flex flex-col items-center justify-center py-8 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                                className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mb-6 ring-4 ring-green-500/5"
                            >
                                <TbCheck className="w-12 h-12 text-green-500" />
                            </motion.div>

                            <h3 className="text-2xl font-bold mb-3 text-foreground">მოთხოვნა მიღებულია!</h3>
                            <p className="text-muted-foreground mb-8 text-lg max-w-[80%]">
                                დაგიკავშირდებით მითითებულ კონტაქტზე უმოკლეს დროში.
                            </p>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/5 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-500/10"
                            >
                                <TbBrandTelegram className="w-5 h-5" />
                                გაგზავნილია Telegram-ზე
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
