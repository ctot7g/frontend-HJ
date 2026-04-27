"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Loader2, Search, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ApiService } from "@/lib/api-service";
import { useAuth } from "@/lib/providers/auth-provider";
import { Order } from "@/lib/types/orders";
import { OrderCard } from "@/app/orders/_components/order-card";

export default function TrackOrderPage() {
  const [trackingInput, setTrackingInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchedValue, setSearchedValue] = useState("");

  const { user } = useAuth();

  const handleSearch = async () => {
    const raw = trackingInput.trim();
    if (!raw) return;

    // Normalise: strip leading "#", uppercase
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
      // Call the dedicated track endpoint — no need to fetch all orders
      const response = await ApiService.fetchWithAuth(
        `/orders/track/${shortId}`
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

        {!user && (
          <p className="mt-3 text-sm text-muted-foreground">
            Please{" "}
            <Link href="/login" className="underline text-blue-600">
              sign in
            </Link>{" "}
            to track your orders.
          </p>
        )}
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
                Use the Order ID shown on your orders page, e.g.{" "}
                <span className="font-mono">#BED88F46</span>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}