"use client";
import AsyncSelect from "react-select/async";
import { useEffect, useState } from "react";
import { fetchProvinces } from "@/service/region/provinceService";
import { fetchRegencies } from "@/service/region/regencyService";
import { SingleValue } from "react-select";
import { ProvinceData } from "@/constants/provinceData";
import { RegencyData } from "@/constants/regencyData";

export interface OptionType {
  value: number;
  label: string;
}

interface RegionSelect {
  initialProvince?: OptionType | null;
  initialRegency?: OptionType | null;
  onProvinceChange: (province: OptionType) => void;
  onRegencyChange: (regency: OptionType) => void;
}

export default function RegionSelect({
  initialProvince = null,
  initialRegency = null,
  onProvinceChange,
  onRegencyChange,
}: RegionSelect) {
  const [selectedProvince, setSelectedProvince] = useState<OptionType | null>(
    initialProvince
  );
  const [selectedRegency, setSelectedRegency] = useState<OptionType | null>(
    initialRegency
  );

  useEffect(() => {
    if (initialProvince) setSelectedProvince(initialProvince);
    if (initialRegency) setSelectedRegency(initialRegency);
  }, [initialProvince, initialRegency]);

  const loadProvinceOptions = async (inputValue: string) => {
    try {
      const response = await fetchProvinces(inputValue);
      return (response.data?.data?.data || []).map((prov: ProvinceData) => ({
        value: prov.id,
        label: prov.name,
      }));
    } catch (error) {
      console.error("Failed to load provinces:", error);
      return [];
    }
  };

  const loadRegencyOptions = async (inputValue: string) => {
    if (!selectedProvince) return [];
    try {
      const response = await fetchRegencies(selectedProvince.value, inputValue);
      return (response.data?.data?.data || []).map((reg: RegencyData) => ({
        value: reg.id,
        label: reg.name,
      }));
    } catch (error) {
      console.error("Failed to load regencies:", error);
      return [];
    }
  };

  return (
    <>
      <div>
        <label className="block text-sm font-bold text-gray-700">
          Province
        </label>
        <AsyncSelect
          defaultOptions
          cacheOptions
          loadOptions={loadProvinceOptions}
          value={selectedProvince}
          onChange={(selected: SingleValue<OptionType>) => {
            if (selected) {
              setSelectedProvince(selected);
              onProvinceChange(selected);
              setSelectedRegency(null);
              onRegencyChange({ value: 0, label: "" });
            }
          }}
          placeholder="Select Province"
          className="mt-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700">City</label>
        <AsyncSelect
          key={selectedProvince?.value}
          defaultOptions
          isDisabled={!selectedProvince}
          cacheOptions
          loadOptions={loadRegencyOptions}
          value={selectedRegency}
          onChange={(selected: SingleValue<OptionType>) => {
            if (selected) {
              setSelectedRegency(selected);
              onRegencyChange(selected);
            }
          }}
          placeholder={
            selectedProvince ? "Select City" : "Select Province first"
          }
          className="mt-1"
          required
        />
      </div>
    </>
  );
}
