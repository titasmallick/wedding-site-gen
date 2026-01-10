"use client";

import { useEffect, useState, use } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import {
  Card,
  CardBody,
  Button,
  Spinner,
  Input,
  addToast,
  Chip,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Slider,
  Image,
} from "@heroui/react";
import { Link } from "@heroui/link";
import { motion, AnimatePresence } from "framer-motion";

import { fontCursive, fontSans, fontMono } from "@/config/fonts";
import firebaseApp from "@/config/firebase";
import { HeartFilledIcon, CheckIcon, MapPinIcon } from "@/components/icons";
import { addContribution } from "../actions";

const db = getFirestore(firebaseApp());

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
}

interface Contribution {
  id: string;
  guestName: string;
  amount: number;
  timestamp: any;
  itemName: string;
}

export default function GuestRegistryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [guest, setGuest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<RegistryItem | null>(null);
  const [contribAmount, setContribAmount] = useState<number>(1000);
  const [captcha, setCaptcha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchGuest = async () => {
      try {
        const docRef = doc(db, "invitation", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setGuest(docSnap.data());
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchGuest();

    // Listen to items
    const qItems = query(collection(db, "registry_items"), orderBy("category"));
    const unsubscribeItems = onSnapshot(qItems, (snapshot) => {
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as RegistryItem[];
      setItems(itemsData);
    });

    // Listen to contributions for the Wall of Generosity
    const qContribs = query(collection(db, "registry_contributions"), orderBy("timestamp", "desc"));      
    const unsubscribeContribs = onSnapshot(qContribs, (snapshot) => {
      const contribsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Contribution[];
      setContributions(contribsData);
    });

    return () => {
      unsubscribeItems();
      unsubscribeContribs();
    };
  }, [slug]);

  const handleContribute = async (onClose: () => void) => {
    if (!selectedItem) return;
    if (captcha !== "10") {
      addToast({ title: "Security Check", description: "Answer correctly!", color: "warning" });
      return;
    }

    if (contribAmount <= 0) {
        addToast({ title: "Invalid Amount", description: "Please enter a valid amount.", color: "danger" });
        return;
    }

    const remaining = (selectedItem.price ?? 0) - (selectedItem.totalContributed ?? 0);
    if (contribAmount > remaining && !selectedItem.groupAllowed) {
        addToast({ title: "Amount exceeded", description: `You can only contribute up to ₹${remaining}.`, color: "danger" });
        return;
    }

    setIsSubmitting(true);
    try {
      const result = await addContribution({
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        slug,
        guestName: guest.name,
        amount: contribAmount,
      });

      if (result.success) {
        addToast({
          title: "Pledge Recorded!",
          description: `We've recorded your gift of ₹${contribAmount} for ${selectedItem.name}. We don't process payments ourselves, so please send the money with generosity by UPI on the next page.`,
          color: "success"
        });
        onClose();
        setCaptcha("");
        // Open sagun in a new tab
        window.open('/sagun', '_blank');
      } else {
        throw new Error(result.error || "Failed to process contribution.");
      }
    } catch (error: any) {
      console.error("Contribution error", error);
      addToast({ title: "Error", description: error.message || "Failed to process contribution.", color: "danger" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Spinner color="danger" size="lg" /></div>;

  if (notFound) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className={`${fontCursive.className} text-4xl text-default-800`}>Invitation Not Found</h1>    
        <p className="text-default-600">We couldn&apos;t find an invitation for this link.</p>
        <Button as={Link} color="primary" href="/" variant="flat">Return Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full py-10 px-4 flex flex-col items-center">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.8 }}
      >
        <header className="text-center mb-12 space-y-4">
          <p className={`${fontMono.className} text-xs uppercase tracking-[0.3em] text-wedding-pink-600 dark:text-wedding-pink-400 font-black`}>
            Wedding Registry
          </p>
          <h1 className={`${fontCursive.className} text-5xl md:text-7xl text-wedding-pink-600 dark:text-wedding-pink-400`}>
            Gifts of Love
          </h1>
          <p className="text-default-500 max-w-xl mx-auto">
            Hi {guest.name}, your presence is our greatest gift. However, if you wish to honor us with a gift, we have curated a list of things we&apos;d love for our new home.
          </p>
        </header>

        {/* Overall Progress Tracker */}
        <div className="mb-12 max-w-2xl mx-auto">
            <Card className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border-none shadow-sm p-6 rounded-[2rem]">
                <div className="flex justify-between items-end mb-3 px-2">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-default-400 mb-1">Registry Completion</p>
                        <p className="text-2xl font-black text-wedding-pink-600">
                            {Math.round((items.reduce((acc, i) => acc + (i.totalContributed ?? 0), 0) / (items.reduce((acc, i) => acc + (i.price ?? 0), 0) || 1)) * 100)}% Funded
                        </p>
                    </div>
                    <p className="text-[11px] font-mono text-default-400">
                        ₹{items.reduce((acc, i) => acc + (i.totalContributed ?? 0), 0).toLocaleString()} / ₹{items.reduce((acc, i) => acc + (i.price ?? 0), 0).toLocaleString()}
                    </p>
                </div>
                <div className="h-4 w-full bg-default-100 dark:bg-zinc-800 rounded-full overflow-hidden p-1">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(items.reduce((acc, i) => acc + (i.totalContributed ?? 0), 0) / (items.reduce((acc, i) => acc + (i.price ?? 0), 0) || 1)) * 100}%` }}
                        className="h-full bg-gradient-to-r from-wedding-pink-500 to-wedding-gold-500 rounded-full"
                    />
                </div>
            </Card>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
            {["All", ...Array.from(new Set(items.map(i => i.category)))].map(cat => (
                <Chip
                    key={cat}
                    as="button"
                    variant={selectedCategory === cat ? "solid" : "flat"}
                    color={selectedCategory === cat ? "danger" : "default"}
                    className={`cursor-pointer transition-all ${selectedCategory === cat ? 'bg-wedding-pink-500 text-white shadow-lg shadow-wedding-pink-500/30' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                >
                    {cat}
                </Chip>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.filter(item => selectedCategory === "All" || item.category === selectedCategory).length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white/40 dark:bg-zinc-900/40 rounded-[2rem] border-2 border-dashed border-default-200">
                  <p className="text-4xl mb-4">🎁</p>
                  <p className={`${fontSans.className} text-xl font-bold text-default-800 dark:text-white`}>
                    {items.length === 0 ? "Our registry is being curated" : "No items in this category"}  
                  </p>
                  <p className="text-default-500 mt-2">
                    {items.length === 0
                      ? "Check back soon as we add items for our new home."
                      : "Try selecting another category to see more gifts."}
                  </p>
                  {items.length > 0 && selectedCategory !== "All" && (
                    <Button
                      variant="flat"
                      color="danger"
                      className="mt-6 font-bold"
                      onClick={() => setSelectedCategory("All")}
                    >
                      Show All Items
                    </Button>
                  )}
                </div>
              ) : (
                items
                  .filter(item => selectedCategory === "All" || item.category === selectedCategory)       
                  .map((item) => {
                const isCompleted = (item.totalContributed ?? 0) >= (item.price ?? 0);
                const progress = Math.min(100, ((item.totalContributed ?? 0) / (item.price || 1)) * 100); 

                return (
                  <Card
                    key={item.id}
                    className={`border-none bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl shadow-xl transition-all hover:scale-[1.02] ${isCompleted ? 'opacity-80' : ''}`}
                  >
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
                        <Chip size="sm" variant="flat" color="warning" className="font-bold uppercase text-[10px]">
                          {item.category}
                        </Chip>
                        {isCompleted && (
                          <Chip size="sm" color="success" startContent={<CheckIcon size={12} />} className="font-bold">
                            Completed
                          </Chip>
                        )}
                      </div>

                      <h3 className="text-xl font-bold mb-1 text-default-800 dark:text-white">{item.name}</h3>
                      <p className="text-default-500 text-sm mb-4">
                        {item.groupAllowed ? "Multiple guests can contribute to this gift." : "A single contribution gift."}
                      </p>

                      {item.storeUrl && (
                        <Button
                          isExternal
                          as={Link}
                          className="mb-4 h-8 bg-default-100 dark:bg-default-200/10 text-[10px] font-bold"
                          href={item.storeUrl.startsWith('http') ? item.storeUrl : `https://${item.storeUrl}`}
                          size="sm"
                          variant="flat"
                        >
                          View Item in Store
                        </Button>
                      )}

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-xs font-black text-default-400">        
                          <span>Goal: ₹{(item.price ?? 0).toLocaleString()}</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-3 w-full bg-default-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-wedding-pink-500 to-wedding-gold-500" 
                            initial={{ width: 0 }}
                          />
                        </div>
                        <p className="text-[10px] text-default-400 font-mono italic">
                          ₹{(item.totalContributed ?? 0).toLocaleString()} contributed so far
                        </p>
                      </div>

                      <Button
                        className={`w-full font-black ${isCompleted ? 'bg-default-100 text-default-400' : 'bg-wedding-pink-500 text-white shadow-lg shadow-wedding-pink-500/30'}`}
                        isDisabled={isCompleted}
                        onPress={() => {
                          setSelectedItem(item);
                          const remaining = (item.price ?? 0) - (item.totalContributed ?? 0);
                          setContribAmount(item.groupAllowed ? Math.min(2000, remaining) : remaining);    
                          onOpen();
                        }}
                      >
                        {isCompleted ? "Fully Gifted" : "Contribute"}
                      </Button>
                    </CardBody>
                  </Card>
                );
              }))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-none bg-white/40 dark:bg-black/40 backdrop-blur-md shadow-sm">        
              <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-wedding-pink-100 dark:bg-wedding-pink-900/30 rounded-lg">        
                    <HeartFilledIcon className="text-wedding-pink-500" size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Wall of Generosity</h2>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {contributions.length === 0 ? (
                    <p className="text-center text-default-400 py-10 text-sm italic">
                      Be the first one to appear here!
                    </p>
                  ) : (
                    contributions.map((c, i) => (
                      <motion.div
                        key={c.id}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-between items-center p-3 rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-white/20"
                        initial={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">{c.guestName}</p>
                          <p className="text-[10px] text-default-400 truncate">Gifted toward {c.itemName}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-wedding-pink-600 dark:text-wedding-pink-400 font-black text-sm">₹{(c.amount ?? 0).toLocaleString()}</p>
                          <p className="text-[9px] text-default-300 font-mono">
                            {c.timestamp?.toDate() ? new Date(c.timestamp.toDate()).toLocaleDateString() : "Today"}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardBody>
            </Card>

            <div className="text-center p-6 space-y-4">
               <p className={`${fontCursive.className} text-2xl text-wedding-pink-600`}>Thank You</p>     
               <p className="text-xs text-default-400 leading-relaxed">
                  Your generosity helps us build our future together. We are truly grateful for your love and support.
               </p>
               <Button as={Link} className="text-wedding-pink-500 font-bold" href={`/invitation/${slug}`} variant="light">
                  Back to Invitation
               </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="center"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Contribute to {selectedItem?.name}
              </ModalHeader>
              <ModalBody className="space-y-6">
                {selectedItem?.imageUrl && (
                    <div className="w-full h-40 rounded-xl overflow-hidden">
                        <Image
                            alt={selectedItem.name}
                            className="w-full h-full object-cover"
                            src={selectedItem.imageUrl}
                        />
                    </div>
                )}

                <div className="p-4 bg-default-50 dark:bg-zinc-900 rounded-2xl border border-default-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-default-400 mb-1">Target Price</p>
                    <p className="text-2xl font-bold">₹{(selectedItem?.price ?? 0).toLocaleString()}</p>
                    <Divider className="my-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-default-400 mb-1">Remaining</p>
                    <p className="text-xl font-bold text-wedding-pink-500">
                        ₹{((selectedItem?.price ?? 0) - (selectedItem?.totalContributed ?? 0)).toLocaleString()}
                    </p>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-bold text-default-600">Choose your contribution amount</p>   
                  {selectedItem?.groupAllowed ? (
                    <>
                        <Slider
                            color="danger"
                            formatOptions={{ style: "currency", currency: "INR" }}
                            label="Amount"
                            maxValue={Math.min(10000, (selectedItem?.price ?? 0) - (selectedItem?.totalContributed ?? 0))}
                            minValue={100}
                            step={100}
                            value={contribAmount}
                            onChange={(val) => setContribAmount(val as number)}
                            classNames={{
                                label: "font-black text-wedding-pink-600",
                                value: "font-mono font-bold"
                            }}
                        />
                        <Input
                            type="number"
                            label="Custom Amount (₹)"
                            labelPlacement="outside-top"
                            value={String(contribAmount)}
                            onChange={(e) => setContribAmount(Number(e.target.value))}
                            variant="bordered"
                            classNames={{ input: "outline-none" }}
                        />
                    </>
                  ) : (
                    <div className="p-4 bg-wedding-pink-50 dark:bg-wedding-pink-900/20 rounded-xl text-center border border-wedding-pink-100">
                        <p className="text-xs text-default-500 mb-1">Total Gift Amount</p>
                        <p className="text-3xl font-black text-wedding-pink-600">₹{(selectedItem?.price ?? 0).toLocaleString()}</p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-wedding-pink-50 dark:bg-wedding-pink-900/10 rounded-2xl border border-wedding-pink-100 dark:border-wedding-pink-800/30">
                    <p className="text-[9px] font-black text-wedding-pink-600 uppercase tracking-widest mb-1">
                        Bot Protection
                    </p>
                    <Input
                        isRequired
                        classNames={{
                            label: "text-[10px]",
                            input: "text-center font-black text-xl outline-none",
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
                <Button
                    className="bg-wedding-pink-500 text-white font-black px-8"
                    isLoading={isSubmitting}
                    onPress={() => handleContribute(onClose)}
                >
                  Confirm & Gift ₹{contribAmount.toLocaleString()}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
