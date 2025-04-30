import { getAssetDetails } from "@/Redux/Assets/Action";
import { payOrder } from "@/Redux/Order/Action";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { DotIcon } from "@radix-ui/react-icons";
import { DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const TradingForm = () => {
  const { coin, asset, wallet } = useSelector((store) => store);
  const [quantity, setQuantity] = useState(0);
  const [amount, setAmount] = useState(0);
  const dispatch = useDispatch();
  const [orderType, setOrderType] = useState("BUY");

  const handleOnChange = (e) => {
    const amount = e.target.value;
    setAmount(amount);
    const volume = calculateBuyCost(amount, coin.coinDetails.market_data.current_price.usd);
    setQuantity(volume);
  };

  function calculateBuyCost(amountUSD, cryptoPrice) {
    let volume = amountUSD / cryptoPrice;

    let decimalPlaces = Math.max(
      2,
      cryptoPrice.toString().split(".")[0].length
    );

    return volume.toFixed(decimalPlaces);
  }

  const handleBuyCrypto = () => {
    dispatch(
      payOrder({
        jwt: localStorage.getItem("jwt"),
        amount,
        orderData: {
          coinId: coin.coinDetails?.id,
          quantity,
          orderType,
        },
      })
    );
  };

  useEffect(()=>{
    dispatch(getAssetDetails({coinId:coin.coinDetails.id,jwt:localStorage.getItem("jwt")}))

  },[])

  return (
    <div className="p-5 space-y-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setOrderType("BUY")}
            className={`${orderType == "BUY" ? "bg-green-600 text-white" : ""}`}
          >
            Buy
          </Button>
          <Button
            onClick={() => setOrderType("SELL")}
            className={`${
              orderType == "SELL" ? "bg-red-600 text-white" : ""
            }`}
          >
            Sell
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <p>Available Balance</p>
          <p className="font-semibold">{wallet.userWallet?.balance}</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-2 border rounded-md px-5 py-3">
          <DollarSign />
          <Input
            className="border-none outline-none"
            placeholder="0.00"
            onChange={handleOnChange}
          />
        </div>
        <div className="flex items-center gap-2 border rounded-md px-5 py-3">
          <Avatar>
            <AvatarImage src={coin.coinDetails?.image.large} />
          </Avatar>
          <Input
            className="border-none outline-none"
            placeholder="0.00"
            value={quantity}
            readOnly
          />
        </div>
      </div>
      <div className="flex gap-5 items-center">
        <div>
          <Avatar>
            <AvatarImage src={coin.coinDetails?.image.large} />
          </Avatar>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p>{coin.coinDetails?.symbol?.toUpperCase()}</p>
            <DotIcon className="text-gray-400" />
            <p className="text-gray-400">{coin.coinDetails?.name}</p>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-xl font-bold">
              {coin.coinDetails?.market_data.current_price.usd}
            </p>
            <p
              className={`${
                coin.coinDetails?.market_data.market_cap_change_24h < 0
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              <span className="">
                {coin.coinDetails?.market_data.market_cap_change_24h}
              </span>
              <span>
                (
                {coin.coinDetails?.market_data.market_cap_change_percentage_24h}
                %)
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="">
        <DialogClose className="w-full">
          <Button
          onClick={handleBuyCrypto}
          className={`w-full py-6 ${
            orderType == "SELL" ? "bg-red-600 text-white" : ""
          }`}
          disabled={
            quantity==0 ||
            (orderType == "SELL" && !asset.assetDetails?.quantity) ||
            (orderType == "SELL" ?
              (asset.assetDetails?.quantity * coin.coinDetails?.market_data.current_price.usd <
                amount):quantity * coin.coinDetails?.market_data.current_price.usd >
                wallet.userWallet?.balance)
          }
        >
          {orderType}
        </Button>
        </DialogClose>
        

        <Button
          onClick={() => setOrderType(orderType == "BUY" ? "SELL" : "BUY")}
          className="w-full mt-5 text-xl"
          variant="link"
        >
          {orderType == "BUY" ? "Or Sell" : "Or Buy"}
        </Button>
      </div>
    </div>
  );
};

export default TradingForm;
