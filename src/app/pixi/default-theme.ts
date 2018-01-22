import { IWindow } from "./window";
import { RowItem, RowContainer, IRowContainer } from "./row-container";
import { IContainer, Container } from "./container";
import { IButton } from "./button";

export class DefaultTheme {
    public static Container = <IContainer>{
        margin: 5,
        corner: 15,
        color: 0x051C38,
        opacity: 0.8,
        x: -200,
        y: -200
    }
    public static Window = <IWindow>{
        header: <IRowContainer>{
            margin: 35,
            left: <RowItem>[{ text: 'Title' }]
        },
        width: 500,
        height: 500,
    }
    public static RowContainer = <IRowContainer> {
        x: 0,
        y: 0,
        width: 500,
        height: 55,
        color: 0x748BA7,
        corner: 0,
        margin: 5,
        opacity: 0,
        left: <Array<RowItem>>[
            { text: 'label' },

            { buttonText: '>' },
            { Button: <IButton>{ text: 'X' } }
        ],
        right: <Array<RowItem>>[
            { Button: <IButton>{ text: 'X' } }
        ]
    }
    public static Button = <IButton> {
        x: 0,
        y: 0,
        width: 45,
        height: 45,
        color: 0x051C38,
        text: 'x'
    }
    public static textStyle = {
        align: 'right',
        fontFamily: 'Arial',
        fontSize: 32,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrapWidth: 440
    }
}