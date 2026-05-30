import ShippingButton from "@/components/playground/ShippingButton";

const PlaygroundContainer = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="mt-14 bg-background p-6 overflow-x-hidden" suppressHydrationWarning>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-[masonry] gap-4 p-4">
                {children}
            </div>
        </div>
    );
};

const Playground = () => {
    return (
        <div>
            <PlaygroundContainer>
                <ShippingButton />
            </PlaygroundContainer>
        </div>
    )
}

export default Playground