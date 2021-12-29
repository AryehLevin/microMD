import React, { useContext, useEffect } from 'react'
import { Text, View,ScrollView,TouchableOpacity } from 'react-native'
// tools
import { loading } from '../../utils/misc_tools'
// data
import { UserContext } from '../../../store/UserContext'
import {useCareplanList} from '../../../store/hooks/useMedinfoData'
// styles
import {appStyles} from '../../../resources/styles/main_styles'
//=============================================================================
// Get Careplan data
//=============================================================================
const CareplanList = () => {

    const user = useContext (UserContext)
    const [state,DataCareplanGetList,DataCareplanSetStatus] = useCareplanList()
    //=============================================================================
    // useEffect - retrieve the data
    //=============================================================================
    useEffect(()=>{
        DataCareplanGetList(user.patient_id)
    },[])
    //=============================================================================
    // CareplanDisplay - displays the list of careplans
    //=============================================================================
    const CareplanDisplay = ({careplandata}) => {

        if (!careplandata || !careplandata.recordset || careplandata.recordset.length === 0)
           return (<View></View>)

        return (
            <View>
                {careplandata.recordset.map((row,index) => (
                <TouchableOpacity key={index} style={appStyles.item}>
                    <Text >{row.description}</Text>
                    <Text >{'Created On:'+row.careplan_date_display}{'  By:'+row.provider_name}</Text>
                </TouchableOpacity> 
               ))}
           </View>
        )
    }
//=============================================================================
    return (
        <ScrollView>
            <Text> Care Plan</Text>
            {state.loading ? loading(true) : loading(false)} 
            <CareplanDisplay careplandata={state.data} /> 
        </ScrollView>
    )
}
 
export default CareplanList;
//=============================================================================