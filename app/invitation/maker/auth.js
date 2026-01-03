"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  addToast,
  Chip,
} from "@heroui/react";
import firebaseApp from "@/config/firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const Auth = ({ userSet }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [user, setUser] = useState(null);

  const auth = getAuth(firebaseApp());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
      userSet(user || null);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(
        auth,
        credentials.username,
        credentials.password
      );
      setCredentials({ username: "", password: "" });
      setModalOpen(false);
      addToast({
        title: "Signed in",
        description: "You have been signed in successfully.",
        color: "success",
        variant: "solid",
        radius: "lg",
        closeIcon: true,
        timeout: 2000,
      });
    } catch (error) {
      addToast({
        title: "Sign-in failed",
        description: "Invalid username or password.",
        color: "danger",
        variant: "solid",
        radius: "lg",
        closeIcon: true,
        timeout: 2000,
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      userSet(null);
      addToast({
        title: "Signed out",
        description: "You have been signed out successfully.",
        color: "danger",
        variant: "solid",
        radius: "lg",
        closeIcon: true,
        timeout: 2000,
      });
    } catch (error) {
      console.error("❌ Sign-out error:", error.message);
    }
  };

  return (
    <>
      <section className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 rounded-lg">
        {!user ? (
          <Button color="primary" onPress={() => setModalOpen(true)}>
            Sign In
          </Button>
        ) : (
          <Button color="danger" onPress={handleSignOut}>
            Sign Out
          </Button>
        )}
        <Chip color={user ? "success" : "danger"}>
          {user ? (
            <>
              Signed in as <strong className="ml-1">{user.email}</strong>
            </>
          ) : (
            "Not signed in"
          )}
        </Chip>
      </section>

      <Modal isOpen={modalOpen} onOpenChange={setModalOpen} backdrop="blur">
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader className="text-xl">Sign In</ModalHeader>
            <ModalBody className="gap-4">
              <Input
                isRequired
                name="username"
                label="Username"
                labelPlacement="outside-top"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={handleChange}
                classNames={{
                  input: "outline-none",
                }}
              />
              <Input
                isRequired
                type="password"
                name="password"
                label="Password"
                labelPlacement="outside-top"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                classNames={{
                  input: "outline-none",
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Auth;
