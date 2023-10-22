import React from "react";
import type { PropsWithChildren } from "react";

import Icon from 'react-native-vector-icons/FontAwesome';

type IconProps = PropsWithChildren<{
    name: string;
}>;

const Icons = ({name} : IconProps) => {
    // if name is image then return image
    if (name === "image") {
        return <Icon name="image" size={30} color="#fff" />;
    }
    // if name is camera then return camera
    if (name === "camera") {
        return <Icon name="camera" size={30} color="#333" />;
    }
}

export default Icons;