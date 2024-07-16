import FormItem from "../../components/items/FormItem";

function Form({data}){
    const formCategories = [
        {category: "근태/휴가", data: data.slice(1, 5)},
        {category: "인사", data: data.slice(5, 9)},
        {category: "회계", data: data.slice(9, 11)},
        {category: "기타", data: data.slice(11)}
    ]

    return (
        <section className="bl_sect hp_mt10">
            <table className="bl_tb2">
                <colgroup>
                    <col style={{width: '200px'}}/>
                    <col style={{width: '*'}}/>
                </colgroup>
                <tbody>
                    {formCategories.map(category => (
                        <tr key={category.category}>
                            <th scope="row">{category.category}</th>
                            <td>
                                {category.data && category.data.map(form => (
                                    <FormItem key={form.afCode} form={form} />
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}

export default Form;