import * as React from "react";
import {Avatar as AvatarUI, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

const Avatar = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>(

    (props, ref) => {
        return (
            <button ref={ref} type="button" {...props}>
                <AvatarUI size="lg">
                    <AvatarFallback>CN</AvatarFallback>
                </AvatarUI>
            </button>
        )
    }
);

Avatar.displayName = "Avatar";

export default Avatar;
