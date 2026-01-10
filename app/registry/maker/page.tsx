"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardBody,
  Button,
  Input,
  addToast,
  Spinner,
  Divider,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Switch,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tabs,
  Tab,
  Image,
} from "@heroui/react";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

import firebaseApp from "@/config/firebase";
import { fontCursive, fontSans } from "@/config/fonts";
import { TrashIcon, CheckIcon, Logo } from "@/components/icons";

const db = getFirestore(firebaseApp());
const auth = getAuth(firebaseApp());

interface RegistryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  groupAllowed: boolean;
  totalContributed: number;
  status: "available" | "completed";
  imageUrl?: string;
  storeUrl?: string;
  received?: boolean;
}

interface Contribution {
  id: string;
  itemId: string;
  itemName: string;
  guestId: string;
  guestName: string;
  amount: number;
  timestamp: any;
  thanked?: boolean;
}

export default function RegistryMakerPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [captcha, setCaptcha] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange
  } = useDisclosure();

  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<Partial<RegistryItem>>({
    name: "",
    category: "",
    price: 0,
    groupAllowed: true,
    imageUrl: "",
    storeUrl: "",
  });

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    // Listen to items
    const qItems = query(collection(db, "registry_items"), orderBy("category"));
    const unsubscribeItems = onSnapshot(qItems, (snapshot) => {
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as RegistryItem[];
      setItems(itemsData);
      setLoading(false);
    });

    // Listen to contributions
    const qContribs = query(collection(db, "registry_contributions"), orderBy("timestamp", "desc"));      
    const unsubscribeContribs = onSnapshot(qContribs, (snapshot) => {
      const contribsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Contribution[];
      setContributions(contribsData);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeItems();
      unsubscribeContribs();
    };
  }, []);

  const handleSaveItem = async (onClose: () => void) => {
    if (!currentItem.name || !currentItem.category || (currentItem.price || 0) <= 0) {
      addToast({ title: "Error", description: "Please fill all fields correctly.", color: "danger" });    
      return;
    }

    if (captcha !== "10") {
        addToast({ title: "Security Check", description: "Answer correctly!", color: "warning" });        
        return;
    }

    try {
      if (currentItem.id) {
        await updateDoc(doc(db, "registry_items", currentItem.id), {
          ...currentItem,
          updatedAt: serverTimestamp(),
        });
        addToast({ title: "Success", description: "Item updated.", color: "success" });
      } else {
        await addDoc(collection(db, "registry_items"), {
          ...currentItem,
          totalContributed: 0,
          status: "available",
          createdAt: serverTimestamp(),
        });
        addToast({ title: "Success", description: "Item added.", color: "success" });
      }
      onClose();
      setCurrentItem({ name: "", category: "", price: 0, groupAllowed: true, imageUrl: "", storeUrl: "" });
      setCaptcha("");
    } catch (error) {
      console.error("Save error", error);
      addToast({ title: "Error", description: "Failed to save item.", color: "danger" });
    }
  };

  const confirmDelete = async (onClose: () => void) => {
    if (!itemToDelete) return;
    try {
      await deleteDoc(doc(db, "registry_items", itemToDelete));
      addToast({ title: "Deleted", description: "Item removed from registry.", color: "warning" });       
      onClose();
    } catch (error) {
      addToast({ title: "Error", description: "Failed to delete item.", color: "danger" });
    }
  };

  const toggleThanked = async (contributionId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "registry_contributions", contributionId), {
        thanked: !currentStatus,
      });
      addToast({ title: "Updated", description: "Contribution status updated.", color: "success" });      
    } catch (error) {
      addToast({ title: "Error", description: "Failed to update status.", color: "danger" });
    }
  };

  const toggleReceived = async (itemId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "registry_items", itemId), {
        received: !currentStatus,
      });
      addToast({ title: "Updated", description: "Item status updated.", color: "success" });
    } catch (error) {
      addToast({ title: "Error", description: "Failed to update status.", color: "danger" });
    }
  };

  if (authLoading) return <div className="flex justify-center p-20"><Spinner color="danger" /></div>;     

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
          <h1 className={`${fontCursive.className} text-4xl text-danger mb-4`}>Access Restricted</h1>     
          <p className="text-default-500">This tool is for administrators only.</p>
          <Button as="a" href="/" className="mt-6 bg-wedding-pink-500 text-white font-bold">Back Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-10 px-4 max-w-6xl mx-auto">
      <section className="text-center mb-12 space-y-4">
        <h1 className={`${fontCursive.className} text-5xl md:text-7xl text-wedding-pink-600 dark:text-wedding-pink-400 py-2`}>
          Registry Manager
        </h1>
        <p className="text-default-500">Curate the gift list and track contributions.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-wedding-pink-500 to-wedding-gold-500 text-white p-6 shadow-xl border-none">
          <p className="text-xs uppercase font-black tracking-widest opacity-80">Total Items</p>
          <p className="text-4xl font-bold">{items.length}</p>
        </Card>
        <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-6 border-none shadow-sm">     
          <p className="text-xs uppercase font-black tracking-widest text-default-400">Total Goal</p>     
          <p className="text-4xl font-bold text-default-800 dark:text-white">
            ₹{items.reduce((acc, item) => acc + (item.price ?? 0), 0).toLocaleString()}
          </p>
        </Card>
        <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-6 border-none shadow-sm">     
          <p className="text-xs uppercase font-black tracking-widest text-default-400">Contributed</p>    
          <p className="text-4xl font-bold text-success">
            ₹{contributions.reduce((acc, c) => acc + (c.amount ?? 0), 0).toLocaleString()}
          </p>
        </Card>
        <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-6 border-none shadow-sm">     
          <p className="text-xs uppercase font-black tracking-widest text-default-400">Contributors</p>   
          <p className="text-4xl font-bold text-wedding-pink-500">
            {new Set(contributions.map(c => c.guestId)).size}
          </p>
        </Card>
      </div>

      <Tabs
        aria-label="Registry Management"
        variant="underlined"
        classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-wedding-pink-500",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-wedding-pink-500 font-bold",
        }}
      >
        <Tab key="items" title="Gift Items">
          <div className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-default-800 dark:text-white">Gift Catalog</h2>       
              <Button
                onPress={() => {
                  setCurrentItem({ name: "", category: "", price: 0, groupAllowed: true, imageUrl: "", storeUrl: "" });
                  onOpen();
                }}
                className="bg-wedding-pink-500 text-white font-bold"
              >
                Add New Gift
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white/40 dark:bg-zinc-900/40 rounded-[2rem] border-2 border-dashed border-default-200">
                  <p className="text-4xl mb-4">✨</p>
                  <p className="text-xl font-bold text-default-800 dark:text-white">Your registry is empty</p>
                  <p className="text-default-500 mt-2">Start by adding items you&apos;d love for your new home.</p>
                  <Button
                    onPress={() => {
                      setCurrentItem({ name: "", category: "", price: 0, groupAllowed: true, imageUrl: "", storeUrl: "" });
                      onOpen();
                    }}
                    className="mt-6 bg-wedding-pink-500 text-white font-bold"
                  >
                    Add Your First Gift
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                <Card key={item.id} className="border-none bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-lg">
                  {item.imageUrl && (
                    <div className="h-48 w-full overflow-hidden rounded-t-xl">
                      <Image
                        alt={item.name}
                        className="w-full h-full object-cover"
                        src={item.imageUrl}
                        radius="none"
                      />
                    </div>
                  )}
                  <CardBody className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Chip size="sm" variant="flat" color="primary">{item.category}</Chip>
                      <div className="flex gap-2 items-center">
                        <div className="flex flex-col items-center mr-2">
                           <span className="text-[8px] font-black uppercase text-default-400 mb-1">Received</span>
                           <Switch
                              size="sm"
                              color="success"
                              isSelected={item.received}
                              onValueChange={() => toggleReceived(item.id, !!item.received)}
                           />
                        </div>
                        <Button isIconOnly size="sm" variant="flat" onPress={() => { setCurrentItem(item); onOpen(); }}>
                          <Logo size={16} />
                        </Button>
                        <Button isIconOnly size="sm" variant="flat" color="danger" onPress={() => { setItemToDelete(item.id); onDeleteOpen(); }}>
                          <TrashIcon size={16} />
                        </Button>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                    <p className="text-default-500 text-sm mb-4">
                        Price: ₹{(item.price ?? 0).toLocaleString()} | {item.groupAllowed ? "Group Allowed" : "Single Gift"}
                    </p>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                            <span>Contribution</span>
                            <span>{Math.round(((item.totalContributed ?? 0) / (item.price || 1)) * 100)}%</span>
                        </div>
                        <div className="h-2 w-full bg-default-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, ((item.totalContributed ?? 0) / (item.price || 1)) * 100)}%` }}
                                className="h-full bg-wedding-pink-500"
                            />
                        </div>
                        <p className="text-xs text-right text-default-400">
                            ₹{(item.totalContributed ?? 0).toLocaleString()} / ₹{(item.price ?? 0).toLocaleString()}
                        </p>
                    </div>

                    {/* Contributors List */}
                    {contributions.filter(c => c.itemId === item.id).length > 0 && (
                      <div className="mt-4 pt-4 border-t border-default-100 dark:border-zinc-800">        
                        <p className="text-[10px] font-black uppercase tracking-widest text-default-400 mb-2">Contributors</p>
                        <div className="space-y-1">
                          {contributions
                            .filter(c => c.itemId === item.id)
                            .map((c) => (
                              <div key={c.id} className="flex justify-between items-center text-[11px]">  
                                <span className="font-bold text-default-700 dark:text-zinc-300 truncate mr-2">{c.guestName}</span>
                                <span className="text-wedding-pink-600 dark:text-wedding-pink-400 font-mono font-bold shrink-0">₹{c.amount.toLocaleString()}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              )))}
            </div>
          </div>
        </Tab>
        <Tab key="contributions" title="Contribution Log">
          <Card className="mt-6 border-none bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-lg">  
            <CardBody className="p-0">
              <Table aria-label="Contributions Table" removeWrapper>
                <TableHeader>
                  <TableColumn>GUEST</TableColumn>
                  <TableColumn>GIFT ITEM</TableColumn>
                  <TableColumn>AMOUNT</TableColumn>
                  <TableColumn>DATE</TableColumn>
                  <TableColumn>THANKED</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No contributions yet.">
                  {contributions.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-bold">{c.guestName}</TableCell>
                      <TableCell>{c.itemName}</TableCell>
                      <TableCell className="text-success font-bold">₹{(c.amount ?? 0).toLocaleString()}</TableCell>
                      <TableCell className="text-default-400 text-xs">
                        {c.timestamp?.toDate() ? new Date(c.timestamp.toDate()).toLocaleString() : "Just now"}
                      </TableCell>
                      <TableCell>
                        <Switch
                          size="sm"
                          color="success"
                          isSelected={c.thanked}
                          onValueChange={() => toggleThanked(c.id, !!c.thanked)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="md"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{currentItem.id ? "Edit Gift" : "Add New Gift"}</ModalHeader>
              <ModalBody className="space-y-4">
                <Input
                  label="Gift Name"
                  labelPlacement="outside-top"
                  placeholder="e.g. Dyson Airwrap"
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                  isRequired
                  variant="bordered"
                  classNames={{ input: "outline-none" }}
                />
                <Input
                  label="Category"
                  labelPlacement="outside-top"
                  placeholder="e.g. Home, Tech, Experience"
                  value={currentItem.category}
                  onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                  isRequired
                  variant="bordered"
                  classNames={{ input: "outline-none" }}
                />
                <Input
                  label="Target Price (₹)"
                  labelPlacement="outside-top"
                  type="number"
                  placeholder="0"
                  value={String(currentItem.price)}
                  onChange={(e) => setCurrentItem({ ...currentItem, price: Number(e.target.value) })}     
                  isRequired
                  variant="bordered"
                  classNames={{ input: "outline-none" }}
                />
                <Input
                  label="Image URL (Optional)"
                  labelPlacement="outside-top"
                  placeholder="https://example.com/image.jpg"
                  value={currentItem.imageUrl}
                  onChange={(e) => setCurrentItem({ ...currentItem, imageUrl: e.target.value })}
                  variant="bordered"
                  classNames={{ input: "outline-none" }}
                />
                <Input
                  label="Store URL (Optional)"
                  labelPlacement="outside-top"
                  placeholder="https://amazon.in/p/..."
                  value={currentItem.storeUrl}
                  onChange={(e) => setCurrentItem({ ...currentItem, storeUrl: e.target.value })}
                  variant="bordered"
                  classNames={{ input: "outline-none" }}
                />
                <div className="flex items-center justify-between p-2 rounded-xl bg-default-50">
                  <span className="text-sm font-medium">Allow Group Contribution</span>
                  <Switch
                    isSelected={currentItem.groupAllowed}
                    onValueChange={(val) => setCurrentItem({ ...currentItem, groupAllowed: val })}        
                    color="danger"
                  />
                </div>

                <Divider />

                <div className="p-4 bg-wedding-pink-50 dark:bg-wedding-pink-900/10 rounded-2xl border border-wedding-pink-100 dark:border-wedding-pink-800/30">
                    <p className="text-xs font-bold text-wedding-pink-600 dark:text-wedding-pink-400 uppercase tracking-widest mb-2">
                        Bot Protection
                    </p>
                    <Input
                        isRequired
                        classNames={{
                            label: "text-default-600 text-xs",
                            input: "text-center font-bold text-xl outline-none",
                        }}
                        label="How many years have we been together?"
                        labelPlacement="outside-top"
                        placeholder="Answer"
                        value={captcha}
                        variant="underlined"
                        onChange={(e) => setCaptcha(e.target.value)}
                    />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancel</Button>
                <Button className="bg-wedding-pink-500 text-white font-bold" onPress={() => handleSaveItem(onClose)}>
                  Save Gift
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        backdrop="blur"
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalBody>
                Are you sure you want to remove this item from the registry? This action cannot be undone.
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancel</Button>
                <Button color="danger" onPress={() => confirmDelete(onClose)}>
                  Delete Item
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
