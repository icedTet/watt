import { useContext, useEffect, useRef, useState } from 'react';
import {Popover} from '@headlessui/react';
import {useAuth, useFirestore} from 'reactfire';
import { ColorResult, SketchPicker } from 'react-color';

// Contexts
import UserDataContext, {SgyPeriodData} from '../../contexts/UserDataContext';

// Utilities
import {updateUserData} from '../../util/firestore';
import {darkPerColors, parsePeriodColor, periodColors, periodNameDefault} from '../schedule/Periods';


type PeriodCustomizationInputProps = {id: string, data: SgyPeriodData};
export default function PeriodCustomizationInput(props: PeriodCustomizationInputProps) {
    const {id, data: {n, c, l, o, s}} = props;
    const name = periodNameDefault(id);

    // Function to update this period's fields on firestore
    const auth = useAuth();
    const firestore = useFirestore();

    const updatePeriodData = async (newValue: string, field: string) =>
        await updateUserData(`classes.${id}.${field}`, newValue, auth, firestore);

    // const [color,setColor] = useState('#fff');
    const userData = useContext(UserDataContext);
    const [color, setColor] = useState(parsePeriodColor(id, userData));
    const changeColor = (color: ColorResult) => setColor(color.hex);

    const upperPeriods = ['0', '1', '2', '3'];
    const isUpperPeriod = upperPeriods.includes(id);

    return (
        <div className="periods-custom-row-burrito flex items-center gap-6">
            <Popover className="relative h-10">
                <Popover.Button
                    className="w-10 h-10 rounded border-2 border-tertiary dark:border-tertiary-dark"
                    style={{backgroundColor: color}}
                />
                <Popover.Panel className={`periods-custom-picker-div-${isUpperPeriod ? 'top' : 'bottom'}`}>
                    {/* TODO: we should consider making our own custom picker for this */}
                    {/* or maybe styling a browser default input; these pickers come with their own component styles */}
                    {/* and, like reactstrap, don't give enough creative freedom to add, say, a "reset to defaults" button */}
                    <SketchPicker
                        color={color}
                        onChange={changeColor}
                        onChangeComplete={(color: ColorResult) => updatePeriodData(color.hex, 'c')}
                        presetColors={userData.options.theme === 'light' ? periodColors : darkPerColors}
                        disableAlpha
                    />
                </Popover.Panel>
            </Popover>

            <div className="flex-grow flex flex-wrap gap-4">
                <div className="flex-grow flex flex-col gap-2">
                    <label htmlFor="class-name" className="secondary text-sm">{name}</label>
                    <input
                        type="text"
                        name="name"
                        id="class-name"
                        className="rounded px-3 py-1.5 bg-gray-50 dark:bg-content-secondary-dark placeholder:text-secondary dark:placeholder:text-secondary-dark placeholder:font-light border border-tertiary dark:border-tertiary-dark"
                        placeholder={name}
                        defaultValue={n}
                        onBlur={e => updatePeriodData(e.target.value, 'n')}
                    />
                </div>

                <div className="flex-grow flex flex-col gap-2">
                    <label htmlFor="link" className="secondary text-sm">{name} Link</label>
                    <input
                        type="text"
                        name="link"
                        id="link"
                        className="rounded px-3 py-1.5 bg-gray-50 dark:bg-content-secondary-dark placeholder:text-secondary dark:placeholder:text-secondary-dark placeholder:font-light border border-tertiary dark:border-tertiary-dark"
                        placeholder={`${name} Link`}
                        defaultValue={l}
                        onBlur={e => updatePeriodData(e.target.value, 'l')}
                    />
                </div>
            </div>
        </div>
    );
}
