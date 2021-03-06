import React, { useContext, useEffect } from 'react'
import { Text, View,ScrollView,TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
// tools
import { loading } from '../../utils/misc_tools'
// data
import { UserContext } from '../../../store/UserContext'
import {useImmunizationList} from '../../../store/hooks/useMedinfoData'
// styles
import {appStyles} from '../../../resources/styles/main_styles'
// navigation
import {NAV_MEDINFO_IMMUNIZATION_DETAIL} from '../../../navigation/route_types' 
//=============================================================================
// Get ImmunizationList data
//=============================================================================
const ImmunizationList = () => {

    const user = useContext (UserContext)
    const [state,stateDetail,DataImmunizationlistGet] = useImmunizationList()
    const navigation = useNavigation();
    //=============================================================================
    // useEffect - retrieve the data
    //=============================================================================
    useEffect(()=>{
        DataImmunizationlistGet(user.patient_id)
    },[])
    //=============================================================================
    // OpenImmunizationDetail - adds a new item
    //=============================================================================
    const OpenImmunizationDetail = (immunization_id) =>{
       user.localStorage.immunization_id = immunization_id
       navigation.navigate(NAV_MEDINFO_IMMUNIZATION_DETAIL)
    }
    //=============================================================================
    // ImmunizationDisplay - displays the list of immunizations
    //=============================================================================
    const ImmunizationDisplay = ({immunizationdata}) => {

        if (!immunizationdata || !immunizationdata.recordset || immunizationdata.recordset.length === 0)
           return (<View></View>)

        return (
            <View>
                {immunizationdata.recordset.map((row) => (
                <TouchableOpacity key={row.immunization_id} style={appStyles.item} 
                     onPress={()=>{OpenImmunizationDetail(row.immunization_id)}}>
                    <Text style={appStyles.bold}>{row.vaccine_name}</Text>
                    <Text >{'Scheduled: '+row.scheduled}{'  Given:'+row.given}</Text>
                    <Text >{'Last Given: '+row.last_given_display} {'  Next Scheduled:'+row.next_sched_display}</Text> 
                </TouchableOpacity> 
               ))}
           </View>
        )
    }
//=============================================================================
    return (
        <ScrollView>
            {state.loading ? loading(true) : loading(false)} 
            <ImmunizationDisplay immunizationdata={state.data} /> 
        </ScrollView>
    )
}
 
export default ImmunizationList;
//=============================================================================