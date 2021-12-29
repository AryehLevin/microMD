import React, { useContext, useEffect, useState } from 'react'
import { Text, View,ScrollView,TouchableOpacity } from 'react-native'
import { TextInput, Divider, Button }from 'react-native-paper'
// form tools
import { updateField, generateData, isFormValid, setDefaultValue,populateOptionFields,
         resetFields,populateFields} from '../../utils/forms/form_actions';
import Formfield from '../../utils/forms/form_fields';
// tools
import { loading,MessageDisplay } from '../../utils/misc_tools'
// data
import { UserContext } from '../../../store/UserContext'
import { RefContext } from '../../../store/RefContext'

import {useContactForm} from '../../../store/hooks/usePatientData'
import {ContactData}   from './contact_edit_data'
// styles
import {appStyles} from '../../../resources/styles/main_styles'
//=============================================================================
// ContactEditForm - edit the note
//=============================================================================
const ContactEditForm = () => {

    const user = useContext (UserContext)
    const ref = useContext(RefContext)
    const [state,loadingState,DataContactGetDetails,DataContactUpdate,
           DataValidationFailure,DataValidationReset] = useContactForm()
    const [formdata,setFormdata] = useState (ContactData)
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
        newFormdata = populateOptionFields(newFormdata,ref.gender,'gender')    
        newFormdata = populateOptionFields(newFormdata,ref.yes_no,'is_primary')    
        newFormdata = populateOptionFields(newFormdata,ref.relationship,'relationship')    
        newFormdata = populateOptionFields(newFormdata,ref.contact_type,'contact_type')   
        newFormdata = populateOptionFields(newFormdata,ref.language,'primary_language')   
        newFormdata = populateOptionFields(newFormdata,ref.states,'state_code')   

        setDefaultValue(newFormdata,'portal_user_id',user.portal_user_id)
        
        let patcontact_id = user.localStorage.patcontact_id
        if (patcontact_id > 0) {  // edit
            DataContactGetDetails(user.patient_id,patcontact_id)  // see useeffect below
        } else {            // add 
            resetFields(newFormdata,'contact')
            setDefaultValue(newFormdata,'patient_id',user.patient_id)
        }

        setFormdata(newFormdata)    
        DataValidationReset() 

    },[])
    //=============================================================================
    // useEffect to load the data from the server (edit)
    //=============================================================================
    useEffect(()=>{
        if (loadingState.loading === false && loadingState.data && loadingState.data.recordset && loadingState.data.recordset.length > 0) {
            let contactData    = loadingState.data.recordset[0]
            let newFormData = formdata
            
            newFormData = populateFields(formdata,contactData)
            setFormdata(newFormData) 
            DataValidationReset()  //otherwize does not refresh
        }
    },[loadingState.loading])   
    //=============================================================================
    // updateFormField (update fields on the form)
    //=============================================================================
    const updateFormField = (id,action,value) => {
        // NOTE: called when loading data 
        //console.log('update field',id,action,value)

        // DataValidationReset()
        const newFormdata = updateField(formdata,id,action,value,'contact');
         setFormdata(newFormdata)    
    }
    //=============================================================================
    // submit form (update information)
    //=============================================================================
    const submitForm = () =>{
 
        let dataToSubmit   = generateData(formdata,'contact');
        let formIsValidRet = isFormValid(formdata,'contact')
       
         if(formIsValidRet.formIsValid){
            DataContactUpdate(dataToSubmit)
         } else {
            DataValidationFailure(formIsValidRet.errorMsg)
         }     
    }
//=============================================================================
    return (
        <ScrollView style={appStyles.form_container}>
            <Text style={appStyles.form_title}> Edit Contact Information</Text>
            <Formfield id={'contact_type'} formdata={formdata.contact_type}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
           <Formfield id={'relationship'} formdata={formdata.relationship}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
            <Formfield id={'is_primary'} formdata={formdata.is_primary}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />            
            <Formfield id={'first_name'} formdata={formdata.first_name}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
            <Formfield id={'last_name'} formdata={formdata.last_name}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
            <Formfield id={'institution_name'} formdata={formdata.institution_name}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
            <Formfield id={'street_address'} formdata={formdata.street_address}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
            <Formfield id={'street_address2'} formdata={formdata.street_address2}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
            <Formfield id={'city'} formdata={formdata.city}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
            <Formfield id={'state_code'} formdata={formdata.state_code}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
            <Formfield id={'zip'} formdata={formdata.zip}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
            <Formfield id={'home_phone'} formdata={formdata.home_phone}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
            <Formfield id={'work_phone'} formdata={formdata.work_phone}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
            <Formfield id={'mobile'} formdata={formdata.mobile}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
            <Formfield id={'email'} formdata={formdata.email}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
            <Formfield id={'fax'} formdata={formdata.fax}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
            <Formfield id={'primary_language'} formdata={formdata.primary_language}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
            <Formfield id={'gender'} formdata={formdata.gender}
                       changefunction={(id,action,value) => updateFormField(id,action,value)} />
                   
             {/* {state.sendSuccess ? MessageDisplay('success',' Contact Information Sent Successfully') : <View></View> }   */}
             {/* {state.error ? MessageDisplay('error','Error: '+state.error) : <View></View> }     */}
            <Button icon="content-save" mode="contained" onPress={submitForm} compact style={{margin:5}}>
               Update Contact Information
            </Button>
           
        </ScrollView>
    )
}
 
export default ContactEditForm;
//=============================================================================
/*
 <TextInput label="Note Type" value={formdata.note_type.value} mode="outlined"
                       onChangeText={(text) => updateFormField('note_type','changed',text)} 
                       placeholder={formdata.subject.config.placeholder} />
           
                       */