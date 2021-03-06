import {forwardRef, HTMLAttributes, InputHTMLAttributes, MutableRefObject, useRef, useState} from "react";
import classNames from "classnames";
import {Div} from "./Layout/Layout";
import {FlexRow} from "./Layout/Flexbox";

/**
 * UI Form
 * @param {HTMLAttributes<HTMLFormElement>} props - HTML Form Props
 * @returns {JSX.Element} - Returns Form Element
 **/
export const Form = (props: HTMLAttributes<HTMLFormElement>) => {
    return (<form {...props}>
        {props.children}
    </form>)
}


/**
 * UI InputField, with forwarded ref, input has default padding and no outline on active state
 * @param {InputHTMLAttributes<HTMLInputElement>} props - Framer motion div element props
 * @param {HTMLInputElement} ref - Ref of the input that is being forwarded
 * @returns {JSX.Element} - Returns Div Element
 **/
export const InputField = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    (props, ref) => (
        <input ref={ref} {...props}
               className={classNames(props.className, "active:outline-0 outline-0 px-2 focus:outline-0")}/>)
)
InputField.displayName = "InputField"


/**
 * UI Label
 * @param {HTMLAttributes<HTMLLabelElement>} props - div element props
 * @returns {JSX.Element} - Returns Div Element
 **/
export const Label = (props: HTMLAttributes<HTMLLabelElement>) => (
    <label {...props}>
        {props.children}
    </label>)

// Generic/Abstract Primary Styled Input Props Interface
/**
 * Interface of primary Styled Input | Globally used Input
 * @param {InputHTMLAttributes<HTMLInputElement>} inputProps - HTML Input Props, props belonging to the root input
 * @param {HTMLAttributes<HTMLLabelElement>} labelProps - Floating label Props
 * @param {InputHTMLAttributes<HTMLInputElement>} iconProps - Right Sided Icon Props
 * @param {HTMLAttributes<HTMLSpanElement>} containerProps - Container of the input group props
 * @param {string | JSX.Element} icon - Icon String | React Icon Component
 * @param {string} label - Label String
 * @param {string | false} validator - Input Validator
 */
interface AbstractInputProps {
    inputProps?: InputHTMLAttributes<HTMLInputElement>,
    labelProps?: HTMLAttributes<HTMLLabelElement>,
    iconProps?: HTMLAttributes<HTMLSpanElement>,
    containerProps?: HTMLAttributes<HTMLDivElement>,
    icon?: string | JSX.Element,
    label?: string,
    dataTestId?: string
    validator?(): string | false
}

/**
 * @param {AbstractInputProps} props
 * @param {any} ref
 */
export const AbstractInput = forwardRef(
    ({
         inputProps,
         labelProps,
         iconProps,
         containerProps,
         icon,
         label,
         validator,
         dataTestId
     }: AbstractInputProps, ref: any) => {

        // Animation variant for validator
        const variants = {
            open: {opacity: 1, y: 0},
            closed: {opacity: 1, y: "-100%"},
        }

        const validation = () => {
            if (validator) {
                return validator();
            }
            return false;
        }


        return (
            <div {...containerProps}>
                <FlexRow className={classNames("group mt-4 relative rounded-lg bg-gray-50",
                    "group border focus-within:border-sky-600 transition-all duration-500",
                    validation() === false ?
                        inputProps.value && "border-emerald-500" : "border-red-500"
                )}>
                    <input ref={ref}
                           required={true}
                           {...inputProps}
                           data-testid={dataTestId}
                           className={classNames(
                               "text-gray-700 autofill-transparent peer",
                               "bg-transparent group-focus-within:border-emerald-500 transition-all",
                               "duration-500 w-full h-12 active:outline-0 outline-0 px-2 focus:outline-0", inputProps && inputProps.className)}
                    />
                    <Label
                        {...labelProps}
                        className={classNames(
                            "absolute  pointer-events-none top-1/2 ",
                            "peer-focus:top-0 peer-focus:before:bg-gray-50 before:h-[60%] before:absolute before:w-full before:bottom-0 before:-z-10 ",
                            "transform left-2 peer-valid:top-0 peer-valid:before:bg-gray-50 bg-transparent",
                            "-translate-y-1/2 text-md peer-focus:text-sky-600 ",
                            "transition-all duration-150 ",
                            validation() === false ?
                                inputProps.value && "text-emerald-500" : "text-red-500",
                            labelProps && labelProps.className
                        )}>
                        {label}
                    </Label>
                    <span
                        {...iconProps}
                        data-testid={`${dataTestId}_icon`}
                        className={classNames("text-2xl peer-focus:text-sky-600 grid place-items-center px-2",
                            validation() === false ?
                                inputProps.value && "text-emerald-500" : "text-red-500",
                            iconProps && iconProps.className
                        )}>
                    {icon}
                </span>
                </FlexRow>
                {
                    validator !== undefined && <Div className={"h-5 overflow-hidden"}>
                        <Div animate={validator && validator() ? "open" : "closed"}
                             variants={variants}>
                            {
                                <p className={"my-0 text-red-500 text-sm"}>
                                    {validator && validator()}
                                </p>
                            }
                        </Div>
                    </Div>
                }
            </div>
        )
    })

AbstractInput.displayName = "AbstractInput"

// If clicking the icon will change attributes of the input group, this interface will be used
export interface InputInterface extends AbstractInputProps {
    iconOnClick?(ref?: MutableRefObject<any>, changeIconState?: Function, iconState?: any): void,
    children?: JSX.Element
}

// Whether the input group will call to action to the icon
const IconActionInput = ({
                             inputProps,
                             iconProps,
                             icon,
                             iconOnClick,
                             label,
                             labelProps,
                             containerProps,
                             dataTestId
                         }: InputInterface) => {
    const inputRef = useRef(null);
    const [currentIcon, changeCurrentIcon] = useState(icon);
    return (
        <>
            <AbstractInput inputProps={inputProps}
                           labelProps={labelProps}
                           ref={inputRef}
                           iconProps={{
                               onClick: () => {
                                   if (iconOnClick) {
                                       iconOnClick(inputRef, changeCurrentIcon, currentIcon)
                                   }
                               },
                               ...iconProps
                           }}
                           dataTestId={dataTestId}
                           containerProps={containerProps}
                           icon={currentIcon}
                           label={label}/>
        </>
    )
}


export function Input(props: InputInterface) {
    if (props.iconOnClick) {
        return <IconActionInput {...props}/>
    }
    return <AbstractInput {...props}/>
}

export const SecondaryInput = ({
                                   inputProps,
                                   iconProps,
                                   containerProps,
                                   icon,
                                   label,
                                   dataTestId,
                                   children
                               }: InputInterface) => {
    return (
        <div {...containerProps} className={classNames("flex flex-row group relative rounded-full",
            "group  transition-all duration-500", containerProps && containerProps.className
        )}>
            <div
                {...iconProps}
                data-testid={`${dataTestId}_icon`}
                className={classNames("text-lg text-gray-500 duration-500 justify-center transition-all peer-focus:bg-theme rounded-md peer-focus:text-white flex items-center px-2",
                    iconProps && iconProps.className
                )}>
                {icon}
            </div>
            <input required={true}
                   {...inputProps}
                   data-testid={dataTestId}
                   placeholder={label}
                   className={classNames(
                       "text-gray-700 selection:bg-theme placeholder:text-sm selection:text-white sm:text-sm text-xs autofill-transparent peer",
                       "bg-transparent group-focus-within:border-emerald-500 transition-all",
                       "duration-500 w-full h-full active:outline-0 outline-0 px-1 focus:outline-0", inputProps && inputProps.className)}
            />

            {children}

        </div>
    )
}
