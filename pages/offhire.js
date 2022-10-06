import { supabase } from "../utils/supabaseClient";
import OffhireTable from '../src/components/OffhireTable';

export async function getStaticProps() {
  const { data: offhire_db, error } = await supabase
    .from("offhire_db")
    .select("*")
    .order("order_date")

  if (error) {
    throw new Error(error.message);
  }

  return {
    props: {
      offhire_db,
    },
  };
}

function offhire({ offhire_db }) {
  return (
    <OffhireTable offhire_db={offhire_db} />
  )
}
export default offhire