from openai import OpenAI
from packaging import version
import os, json, openai, asyncio
from time import sleep
# from openai import OpenAI
from django.http import JsonResponse
from django.shortcuts import render
from django.conf import settings
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
# from .models import TestModel
# from .serializers import TestModelSerializer
from .functions import create_assistant

# Check OpenAI version is correct
required_version = version.parse("1.1.1")
current_version = version.parse(openai.__version__)
OPENAI_API_KEY = settings.OPENAI_API_KEY
if current_version < required_version:
  raise ValueError(f"Error: OpenAI version {openai.__version__}"
                   " is less than the required version 1.1.1")
else:
  print("OpenAI version is compatible.")

# Init client
client = OpenAI(api_key=settings.OPENAI_API_KEY)  # should use env variable OPENAI_API_KEY in secrets (bottom left corner)

# Create new assistant or load existing
assistant_id = create_assistant(client)

# Start conversation thread
@api_view(['GET'])
def start_conversation(request):
  print("Starting a new conversation...")  # Debugging line
  print("Here is the request: ", request)
  thread = client.beta.threads.create()
  print(f"New thread created with ID: {thread.id}")  # Debugging line
  welcome_message = "Welcome to Ai Integrations! How can I help you today?"
  return JsonResponse({"thread_id": thread.id, "welcome_message": welcome_message})

# Generate response
@api_view(['POST'])
def chat(request):
  data = request.data
  thread_id = data.get('thread_id')
  user_input = data.get('message', '')

  if not thread_id:
    print("Error: Missing thread_id")  # Debugging line
    return JsonResponse({"error": "Missing thread_id"}), 400

  print(f"Received message: {user_input} for thread ID: {thread_id} and assistant_id: {assistant_id}"
        )  # Debugging line

  # Add the user's message to the thread
  client.beta.threads.messages.create(thread_id=thread_id,
                                      role="user",
                                      content=user_input)

  # Run the Assistant
  run = client.beta.threads.runs.create(thread_id=thread_id,
                                        assistant_id=assistant_id)

  # Check if the Run requires action (function call)
  while True:
    run_status = client.beta.threads.runs.retrieve(thread_id=thread_id,
                                                   run_id=run.id)
    print(f"Run status: {run_status.status}")
    if run_status.status == 'completed':
      break
    sleep(1)  # Wait for a second before checking again

  # Retrieve and return the latest message from the assistant
  messages = client.beta.threads.messages.list(thread_id=thread_id)
  response = messages.data[0].content[0].text.value

  print(f"Assistant response: {response}")  # Debugging line
  return JsonResponse({"response": response})


@api_view(['POST'])
def chatbot_view(request):
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    business_context = """
This chatbot is for a company called " Ai Integrations". There are text files in the sources this chatbot should use for reference to respond to questions. 

Chatbot should never say " I " and should use either "we" or "Ai Integrations"

The purpose of this chatbot is to provide our potential customers an opportunity to use our custom conversational AI.

This chatbots goal is to get customers to contact us regarding implementing AI and specifically AI Chatbots made by AI Integrations into their business. ( note use subtle sales tactics and do not be pushy).

The link to contact Ai Integrations, ( https://aiintegrations.tech/#Contact) use this link when customers seem ready to "close the sale" and get in touch with Ai Integrations  

"""
    # Check if there's an existing conversation history in the session
    if 'conversation_history' not in request.session or not request.session['conversation_history']:
        # Initialize with business context
        request.session['conversation_history'] = [{"role": "system", "content": business_context}]

    conversation_history = request.session['conversation_history']

    # Include the user's message in the conversation history
    user_message = request.data.get('message')
    conversation_history.append({"role": "user", "content": user_message})

    # Make the API request
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=conversation_history
    )

    # Extract the chatbot's response and update the conversation history
    chatbot_response = response.choices[0].message.content
    conversation_history.append({"role": "system", "content": chatbot_response})

    # Store the updated conversation history in the session
    request.session['conversation_history'] = conversation_history
    print(conversation_history)

    return Response({'response': chatbot_response})

# @api_view(['POST'])
# def chatbot_view(request):
#     client = OpenAI(api_key=settings.OPENAI_API_KEY)

#     # Retrieve conversation history from the session
#     conversation_history = request.session.get('conversation_history', [])

#     # Include the user's message in the conversation history
#     user_message = request.data.get('message')
#     conversation_history.append({"role": "user", "content": user_message})

#     # Make the API request
#     response = client.chat.completions.create(
#         model="gpt-3.5-turbo",
#         messages=conversation_history
#     )

#     # Extract the chatbot's response and update the conversation history
#     chatbot_response = response.choices[0].message.content
#     conversation_history.append({"role": "system", "content": chatbot_response})

#     # Store the updated conversation history in the session
#     request.session['conversation_history'] = conversation_history

#     return Response({'response': conversation_history})

# @api_view(['POST'])
# def chatbot_view(request):
#     client = OpenAI(api_key=settings.OPENAI_API_KEY)

#     response = client.chat.completions.create(
#         model="gpt-3.5-turbo",  # Adjust the model as needed
#         messages=[
#             {"role": "user", "content": request.data.get('message')}
#         ]
#     )

#     # Extract the response content. Adjust this line as per the actual method/property.
#     response_data = response.choices[0].message.content

#     return Response({'response': response_data})

# @api_view(['POST'])
# def chatbot_view(request):
#     client = OpenAI(api_key=settings.OPENAI_API_KEY)

#     response = client.chat.completions.create(model="gpt-3.5-turbo",  # Adjust the model as needed
#     messages=[
#         {"role": "user", "content": request.data.get('message')}
#     ])

#     return JsonResponse({'response': response['choices'][0]['message']['content']})
    


 # response = openai.chat.completions.create(
    #     model="gpt-4",
    #     messages=[
    #         {"role": "system", "content": "You are a knowledgeable assistant."},
    #         {"role": "user", "content": request.data.get('message')}
    #         # Include more messages here as needed for context
    #     ],
    # )


# @api_view(['POST'])
# def chatbot_response(request):
    # openai.api_key = settings.OPENAI_API_KEY
    # client = OpenAI()

    # # Create Thread (POST)
    # userThread = client.beta.threads.create()
    # thrd_id = userThread.thread_id

    # # Create Message (POST)
    # thread_message = client.beta.threads.messages.create(
    #     thrd_id,
    #     role="user",
    #     content = request.data.get('message'),
    # )
    # print(thread_message)

    # # List Messages (GET)
    # thread_messages = client.beta.threads.messages.list(thrd_id)
    # print(thread_messages.data)

    # # Create Run (POST)
    # run = client.beta.threads.runs.create(
    #     thread_id=thrd_id,
    #     assistant_id="asst_JC8xbzG6EnJ4ch6cvpko3eDt"
    # )
    # print(run)

    # # List Messages (GET)
    # thread_messages = client.beta.threads.messages.list(thrd_id)
    # print(thread_messages.data)




#     return Response({"response": response.choices[0].message.content})

# openai.api_key = settings.OPENAI_API_KEY
#     print(settings.OPENAI_API_KEY)
#     # client = OpenAI()

#     # # Create Thread (POST)
#     userThread = openai.beta.threads.create()
#     thrd_id = userThread.id

#     # Create Message (POST)
#     thread_message = openai.beta.threads.messages.create(
#         thrd_id,
#         role="user",
#         content = request.data.get('message'),
#     )
#     print(thread_message)

#     # Create Run (POST)
#     run = openai.beta.threads.runs.create(
#         thread_id=thrd_id,
#         assistant_id="asst_JC8xbzG6EnJ4ch6cvpko3eDt"
#     )
#     print("MBA: ",run.id)


#     max_attempts = 7
#     attempt = 0

#     while attempt < max_attempts:
#         run_status = openai.beta.threads.runs.retrieve(run_id=run.id, thread_id=thrd_id)  # Assuming async method is available
#         if run_status.status == 'completed' or run_status.status == 'failed':
#             break

#         sleep(2)  # Asynchronous sleep
#         attempt += 1

#     # Retrieve and process the messages
#     thread_messages = openai.beta.threads.messages.list(thrd_id)  # Assuming async method is available
#     print(thread_messages.data)

#     return Response({"response": thread_messages.data})