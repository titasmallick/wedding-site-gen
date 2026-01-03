"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  addToast,
} from "@heroui/react";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import firebaseApp from "@/config/firebase";

export const AdminAuth = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = getAuth(firebaseApp());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      addToast({
        title: "Welcome Titas",
        description: "Admin access granted.",
        color: "success",
      });
      setIsOpen(false);
      setEmail("");
      setPassword("");
    } catch (error) {
      addToast({
        title: "Access Denied",
        description: "Invalid credentials.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      addToast({
        title: "Signed Out",
        description: "Admin session ended.",
        color: "warning",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-[10px] text-default-300 dark:text-default-700 hover:text-wedding-pink-500 transition-colors opacity-30 hover:opacity-100 focus:outline-none"
        aria-label="Admin Access"
      >
        ●
      </button>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen} backdrop="blur" placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {user ? "Admin Profile" : "Secure Login"}
              </ModalHeader>
              <ModalBody>
                {user ? (
                  <div className="py-4 text-center">
                    <p className="text-default-500 mb-2">Logged in as</p>
                    <p className="font-bold text-lg text-wedding-pink-600">{user.email}</p>
                  </div>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                      label="Admin Email"
                      labelPlacement="outside-top"
                      placeholder="Enter admin email"
                      variant="bordered"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      isRequired
                      classNames={{ input: "outline-none" }}
                    />
                    <Input
                      label="Password"
                      labelPlacement="outside-top"
                      placeholder="Enter password"
                      type="password"
                      variant="bordered"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      isRequired
                      classNames={{ input: "outline-none" }}
                    />
                    <Button
                      type="submit"
                      color="primary"
                      className="w-full bg-wedding-pink-500"
                      isLoading={loading}
                    >
                      Login
                    </Button>
                  </form>
                )}
              </ModalBody>
              <ModalFooter>
                {user ? (
                  <Button color="danger" variant="flat" onClick={handleLogout} className="w-full">
                    Logout
                  </Button>
                ) : (
                  <Button variant="light" onClick={onClose} className="w-full">
                    Cancel
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
