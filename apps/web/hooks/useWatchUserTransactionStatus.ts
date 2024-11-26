"use client"

import { BridgeTransactionType, useTransactionInfo } from '@orbiter-finance/widget'
import React, { useCallback, useEffect, useState } from 'react'
import mqtt, { MqttClient } from 'mqtt'
import { MQTT_CONFIG } from '../app/constant'

export default function useWatchUserTransactionStatus() {
  const TransactionInfo = useTransactionInfo()
  const [mqttClient, setMqttClient] = useState<MqttClient | null>(null)

  const init = useCallback(
    async () => {
      console.log("TransactionInfo", TransactionInfo)
      const { href, ...rest } = MQTT_CONFIG
      console.log("MQTT_CONFIG", MQTT_CONFIG)

      let client: MqttClient | null = mqttClient
      try {
        if (!mqttClient?.connected) {
          client = mqtt.connect(href, {
            ...rest
          })
        }
        console.log("client", client, TransactionInfo)
        client.on('connect', () => {
          console.log('Connected to MQTT broker')
          client.subscribe(
            `bridge-success/address/${TransactionInfo?.fromAddress}`,
            (err) => {
              if (!err) {
                console.log('Subscribed to user/+/message')
              } else {
                console.log('2222222222', err)
                setMqttClient(null)
              }
            }
          )
          client.on('message', (topic, message) => {
            const res = JSON.parse(
              message.toString() || JSON.stringify({})
            )
            console.log("res", topic, message, res)
          })
        })

        setMqttClient(client)
      } catch (error) {
        console.log("error11", error)
        try {
          await mqttClient.unsubscribeAsync(`bridge-success/address/${TransactionInfo?.fromAddress}`)
        } catch (error) {
        console.log("error2222", error)
          
        }
      }
    },
    [TransactionInfo, mqttClient],
  )


  useEffect(() => {
    if (TransactionInfo?.srcTx && !mqttClient && (Number(TransactionInfo?.status) < 97)) {
      init()
    }
  }, [TransactionInfo?.srcTx, TransactionInfo?.status, mqttClient])
}

