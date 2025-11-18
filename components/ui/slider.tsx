import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	min?: number;
	max?: number;
	step?: number;
	value?: number;
	onChange?: (value: number) => void;
	label?: string;
	showValue?: boolean;
	formatValue?: (value: number) => string;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
	(
		{
			className,
			min = 0,
			max = 100,
			step = 1,
			value = 50,
			onChange,
			label,
			showValue = true,
			formatValue,
			...props
		},
		ref,
	) => {
		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			onChange?.(parseFloat(e.target.value));
		};

		const percentage = ((value - min) / (max - min)) * 100;

		return (
			<div className={cn("w-full", className)}>
				{(label || showValue) && (
					<div className="flex items-center justify-between mb-2">
						{label && (
							<label className="text-sm font-medium text-foreground">
								{label}
							</label>
						)}
						{showValue && (
							<span className="text-sm font-semibold text-primary">
								{formatValue ? formatValue(value) : value}
							</span>
						)}
					</div>
				)}
				<div className="relative">
					<input
						ref={ref}
						type="range"
						min={min}
						max={max}
						step={step}
						value={value}
						onChange={handleChange}
						className={cn(
							"w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer",
							"focus:outline-none focus:ring-2 focus:ring-leaf-green focus:ring-offset-2",
							"[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110",
							"[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110",
						)}
						style={{
							background: `linear-gradient(to right, #6CBE45 0%, #6CBE45 ${percentage}%, #F5F5F5 ${percentage}%, #F5F5F5 100%)`,
						}}
						{...props}
					/>
				</div>
			</div>
		);
	},
);

Slider.displayName = "Slider";
