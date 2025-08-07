import MedicineTable from '@/components/materials/MedicineTable';

export default function Page() {
    return (
        <div className="p-6">
            <div className="text-2xl font-bold mb-6">急救药品库存</div>
            <MedicineTable />
        </div>
    );
}