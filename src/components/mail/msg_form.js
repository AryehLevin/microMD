import React, { useContext, useEffect, useState } from 'react'
import { Text, View,ScrollView,TouchableOpacity } from 'react-native'
import { Button }from 'react-native-paper'

// form tools
import { updateField, generateData, isFormValid, setDefaultValue,populateOptionFields,
         resetFields,populateFields} from '../utils/forms/form_actions';
import Formfield from '../utils/forms/form_fields';
// tools
import { loading,MessageDisplay } from '../utils/misc_tools'
// data
import { UserContext } from '../../store/UserContext'
import { RefContext } from '../../store/RefContext'

import { useMessageForm } from '../../store/hooks/useMailData'
import {messageData}   from './msg_data'
// styles
import {appStyles} from '../../resources/styles/main_styles'
import { AppButton } from '../utils/misc_tools';
//=============================================================================
// MsgForm - create a new msg
//=============================================================================
const MsgForm = () => {

    const user = useContext (UserContext)
    const ref = useContext(RefContext)
    const [state,DataMailSendMsg,DataValidationFailure,
           DataValidationReset] = useMessageForm()
    const [formdata,setFormdata] = useState (messageData)
    //=============================================================================
    // goback (goes back to the calling screen)
    //=============================================================================
    const goBack = () => {
        //history.goBack()
    }    
    //=============================================================================
    // useEffect to close form once sent
    // if state.sendSuccess then display success message for 2 seconds and close the form
    //=============================================================================
    useEffect(()=>{
        if (state.sendSuccess === true) {
            setTimeout(()=>{ goBack() },2000)
        }
     },[state.sendSuccess])  
    //=============================================================================
    // useEffect - retrieve the data and setup the form
    //=============================================================================
    useEffect(()=>{

        let newFormdata = formdata
        // set dropdowns
        newFormdata = populateOptionFields(newFormdata,ref.msgTypes,'message_type')    
        newFormdata = populateOptionFields(newFormdata,ref.providerList,'receiver_id')  
    
        let msgFor  = user.localStorage.msgFor
        let msgType = user.localStorage.msgType
        let refId   = user.localStorage.refId
        
        if(msgFor)  { setDefaultValue(newFormdata,'receiver_id',msgFor)}
        if(msgType) { setDefaultValue(newFormdata,'message_type',msgType)}
     
        setDefaultValue(newFormdata,'portal_user_id',user.portal_user_id)
        setDefaultValue(newFormdata,'sender_name',user.portal_user_name)
        setDefaultValue(newFormdata,'patient_id',user.patient_id)
        setDefaultValue(newFormdata,'patient_name',user.patient_name)
        setDefaultValue(newFormdata,'replyto_msg_id',refId)
       
        setFormdata(newFormdata)    
        DataValidationReset() 

    },[])
    //=============================================================================
    // updateFormField (update fields on the form)
    //=============================================================================
    const updateFormField = (id,action,value) => {
        // NOTE: called when loading data 
        //console.log('update field',id,action,value)

        // DataValidationReset()
        const newFormdata = updateField(formdata,id,action,value,'message');
         setFormdata(newFormdata)    
    }
    //=============================================================================
    // submit form (update information)
    //=============================================================================
    const submitForm = () =>{
 
        let dataToSubmit   = generateData(formdata,'message');
        let formIsValidRet = isFormValid(formdata,'message')
      //  console.log('data to submit',dataToSubmit)
         if(formIsValidRet.formIsValid){
            DataMailSendMsg(dataToSubmit)
         } else {
            DataValidationFailure(formIsValidRet.errorMsg)
         }     
    }
//=============================================================================
    return (
        <ScrollView>
            {/* <Text> New Message</Text> */}
            <Formfield id={'receiver_id'} formdata={formdata.receiver_id}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
           <Formfield id={'message_type'} formdata={formdata.message_type}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
            <Formfield id={'subject'} formdata={formdata.subject}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />            
            <Formfield id={'message'} formdata={formdata.message}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
             {state.sendSuccess ? MessageDisplay('success','Message Successfully Send') : <View></View> }  
             {/* {state.error ? MessageDisplay('error','Error: '+state.error) : <View></View> }     */}
            <AppButton type='send' title='Send Message' onPress={submitForm}/>
           
        </ScrollView>
    )
}
 
export default MsgForm;
//=============================================================================