import ShippingButton from "@/components/playground/ShippingButton";
import StaggerSidebar from "@/components/playground/StaggerSidebar";
import { BentoCell, BentoCell4, BentoGrid, BentoGrid4 } from "@/components/ui/BentoGrid";

const Playground = () => {
    return (
        <div className="mt-14 md:mt-24 mb-16 md:mb-0 p-4 flex flex-col gap-4">
            <BentoGrid4>
                <BentoCell4 span={1} label="Sequence Animated Shipping Button"><ShippingButton /></BentoCell4>
                <BentoCell4 span={3} label="Staggering Sidebar"><StaggerSidebar /></BentoCell4>
            </BentoGrid4>
        </div>
    )
}

export default Playground