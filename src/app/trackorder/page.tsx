"use client";

import { useState, useEffect } from "react";
import { Loader2, Search, PackageSearch } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiService } from "@/lib/api-service";
import { Order } from "@/lib/types/orders";
import { OrderCard } from "@/app/orders/_components/order-card";

export default function TrackOrderPage() {
  const [trackingInput, setTrackingInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchedValue, setSearchedValue] = useState("");

  const searchParams = useSearchParams();

  const performSearch = async (id: string) => {
    const raw = id.trim();

    // Require # prefix
    if (!raw.startsWith("#")) {
      setHasSearched(true);
      setSearchedValue(raw);
      setMatchedOrder(null);
      return;
    }

    const shortId = raw.replace(/^#/, "").trim().toUpperCase();

    if (shortId.length !== 8) {
      setHasSearched(true);
      setSearchedValue(raw);
      setMatchedOrder(null);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setSearchedValue(raw);
    setMatchedOrder(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/track/${shortId}`
      );

      if (response.ok) {
        const order: Order = await response.json();
        setMatchedOrder(order);
      } else {
        setMatchedOrder(null);
      }
    } catch {
      setMatchedOrder(null);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setTrackingInput(id);
      performSearch(id);
    }
  }, [searchParams]);

  const handleSearch = async () => {
    const raw = trackingInput.trim();
    if (!raw) return;
    await performSearch(raw);
  };

  return (
    <div className="px-4 sm:px-[32px] py-8">
      <div className="mb-8">
        <h1 className="font-bebas text-3xl">Track Order</h1>
        <p className="text-muted-foreground mt-1">
          Enter your Order ID to see its current status.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-xl">
        <p className="mb-2 text-sm text-muted-foreground">
          Enter the Order ID shown on your order
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Enter Tracking ID"
            value={trackingInput}
            onChange={(e) => setTrackingInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="font-mono uppercase"
          />
          <Button
            onClick={handleSearch}
            disabled={!trackingInput.trim() || isSearching}
            className="bg-blue-600 cursor-pointer hover:bg-blue/90 text-white"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="mt-8">
          {isSearching ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Searching your orders...</span>
            </div>
          ) : matchedOrder ? (
            <div>
              <p className="mb-4 text-sm text-muted-foreground">
                Order found:
              </p>
              <OrderCard order={matchedOrder} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
              <PackageSearch className="h-12 w-12 mb-3 opacity-40" />
              <p className="font-medium text-gray-700">No order found</p>
              <p className="text-sm mt-1">
                No order matched{" "}
                <span className="font-mono font-semibold">
                  &quot;{searchedValue}&quot;
                </span>
                .<br />
                Use the Order ID shown on your confirmation email, e.g.{" "}
                <span className="font-mono">#BED88F46</span>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}