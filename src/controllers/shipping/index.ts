import { ShippingService } from "@/service/ShippingService/Shipping.service";
import { ShippingController } from "./shipping.controller";
import { AddressRepository } from "@/repository/prisma/address/address.prisma";
import { DistanceProvider } from "@/provider/DistanceProvider";

const addressRepository = new AddressRepository();
const distanceProvider = new DistanceProvider();

const shippingService = new ShippingService(addressRepository, distanceProvider);
const shippingController = new ShippingController(shippingService);

export {shippingController}
